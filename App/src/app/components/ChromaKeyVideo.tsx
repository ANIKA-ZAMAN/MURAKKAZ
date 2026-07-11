"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./ChromaKeyVideo.module.css";

interface ChromaKeyVideoProps {
  videoSrc: string;
  placeholderSrc: string;
  alt: string;
}

export default function ChromaKeyVideo({ videoSrc, placeholderSrc, alt }: ChromaKeyVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [fadeToStatic, setFadeToStatic] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  // Professional Sage Green keying parameters
  const similarity = 0.18;   // Distance threshold below which pixels are transparent
  const smoothness = 0.12;   // Feathering range
  const spillScale = 0.9;     // Spill suppression strength

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize WebGL
    const gl = canvas.getContext("webgl", { 
      alpha: true, 
      premultipliedAlpha: false
    });

    if (!gl) {
      console.warn("WebGL not supported, falling back to static placeholder.");
      setWebglSupported(false);
      setIsPlaying(false);
      return;
    }

    // Vertex Shader
    const vsSource = `
      attribute vec2 position;
      varying vec2 vTexCoord;
      void main() {
        vTexCoord = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader with professional HSV distance keying, corner sampling & spill suppression
    const fsSource = `
      precision mediump float;
      varying vec2 vTexCoord;
      uniform sampler2D uTexture;
      uniform float uSimilarity;
      uniform float uSmoothness;
      uniform float uSpillScale;

      // RGB to HSV conversion
      vec3 rgb2hsv(vec3 c) {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
      }

      void main() {
        vec4 color = texture2D(uTexture, vTexCoord);
        
        // Dynamically sample background color from top-left corner (0.05, 0.95)
        vec3 keyColor = texture2D(uTexture, vec2(0.05, 0.95)).rgb;
        
        // If the video frame is not loaded or is black, fallback to default sage green
        if (keyColor.g < 0.15 || keyColor.g < keyColor.r) {
          keyColor = vec3(0.29, 0.42, 0.38); // default sage-green
        }

        vec3 hsv = rgb2hsv(color.rgb);
        vec3 keyHsv = rgb2hsv(keyColor);

        // Circular distance in Hue space
        float hueDiff = abs(hsv.x - keyHsv.x);
        if (hueDiff > 0.5) {
          hueDiff = 1.0 - hueDiff;
        }

        // Saturation and Value differences
        float satDiff = abs(hsv.y - keyHsv.y);
        float valDiff = abs(hsv.z - keyHsv.z);

        // Measure distance in HSV space: hue is most important (weight 4.0),
        // saturation and value differences have lower weights.
        float dist = sqrt(hueDiff * hueDiff * 4.0 + satDiff * satDiff * 0.5 + valDiff * valDiff * 0.5);

        // Preserve reflections & shadows:
        // White highlights (low sat) and dark details/shadows (low value) should remain opaque.
        if (hsv.y < 0.15 || hsv.z < 0.12) {
          dist = 1.0;
        }

        // Mask calculation: 0 = background (transparent), 1 = foreground (opaque)
        float mask = smoothstep(uSimilarity, uSimilarity + uSmoothness, dist);

        // Spill suppression: if the hue is close to the key hue, suppress green-blue tint
        vec3 rgb = color.rgb;
        if (hueDiff < 0.15) {
          float spillFactor = 1.0 - (hueDiff / 0.15);
          // Clamp green to the average of red and blue (desaturate backing color reflection)
          float avgRb = (rgb.r + rgb.b) * 0.5;
          if (rgb.g > avgRb) {
            rgb.g = mix(rgb.g, avgRb, spillFactor * uSpillScale);
          }
        }

        gl_FragColor = vec4(rgb, color.a * mask);
      }
    `;

    // Helper: Compile Shader
    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    // Create Program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad Vertices
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const similarityLoc = gl.getUniformLocation(program, "uSimilarity");
    const smoothnessLoc = gl.getUniformLocation(program, "uSmoothness");
    const spillScaleLoc = gl.getUniformLocation(program, "uSpillScale");

    gl.uniform1f(similarityLoc, similarity);
    gl.uniform1f(smoothnessLoc, smoothness);
    gl.uniform1f(spillScaleLoc, spillScale);

    // Create Texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Load Video
    const video = document.createElement("video");
    video.src = videoSrc;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.preload = "auto";
    videoRef.current = video;

    let animationFrameId: number;
    let videoCallbackId: number;
    let isTransitioning = false;

    const renderFrame = () => {
      if (!gl || !canvas || !video) return;

      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      if (videoWidth && videoHeight && (canvas.width !== videoWidth || canvas.height !== videoHeight)) {
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const handleVideoEnd = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      setFadeToStatic(true);
      setTimeout(() => {
        setIsPlaying(false);
      }, 300); // Allow fade animation to complete
    };

    const setupPlayback = () => {
      // Warm up: draw first frame immediately once video has metadata
      renderFrame();

      video.play().catch((err) => {
        console.warn("Autoplay was blocked or failed:", err);
      });

      // Render loop utilizing requestVideoFrameCallback for maximum synchronization and performance
      const updateFrame = () => {
        if (isTransitioning) return;

        if (video.readyState >= video.HAVE_CURRENT_DATA) {
          renderFrame();
        }

        // Check if video ended
        if (video.ended || (video.currentTime >= video.duration - 0.05 && video.duration > 0)) {
          handleVideoEnd();
          return;
        }

        if ("requestVideoFrameCallback" in video) {
          videoCallbackId = (video as any).requestVideoFrameCallback(updateFrame);
        } else {
          animationFrameId = requestAnimationFrame(updateFrame);
        }
      };

      if ("requestVideoFrameCallback" in video) {
        videoCallbackId = (video as any).requestVideoFrameCallback(updateFrame);
      } else {
        animationFrameId = requestAnimationFrame(updateFrame);
      }
    };

    if (video.readyState >= video.HAVE_METADATA) {
      setupPlayback();
    } else {
      video.onloadedmetadata = setupPlayback;
    }

    // Video error fallback
    video.onerror = () => {
      console.error("Video failed to load.");
      setWebglSupported(false);
      setIsPlaying(false);
    };

    return () => {
      isTransitioning = true;
      if (videoCallbackId) {
        (video as any).cancelVideoFrameCallback(videoCallbackId);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      video.pause();
      video.remove();
    };
  }, [videoSrc]);

  return (
    <div ref={containerRef} className={styles.wrapper}>
      {/* 1. Natural Soft Shadow (Pulsing and scaling with float) */}
      <div className={styles.shadow} />

      {/* 2. Floating Container */}
      <div className={styles.floatContainer}>
        {/* WebGL Canvas for video / frame playback */}
        {webglSupported && (
          <canvas
            ref={canvasRef}
            className={styles.canvas}
            style={{
              opacity: isPlaying && !fadeToStatic ? 1 : 0,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Static Bottle Image (fades in when animation ends) */}
        <Image
          src={placeholderSrc}
          alt={alt}
          width={260}
          height={430}
          priority
          className={styles.image}
          style={{
            opacity: fadeToStatic || !webglSupported ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
}
