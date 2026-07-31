const fs = require('fs');
const path = require('path');

const normalPerfumes = [
  {
    name: "Ultra Male", brand: "Jean Paul Gaultier", gender: "MEN", family: "GOURMAND",
    desc: "A bold, captivating scent featuring sweet juicy pear and warm cinnamon layered over rich vanilla and woods—intense, playful, and alluring.",
    top: ["Pear", "Lavender", "Mint", "Bergamot", "Lemon"],
    mid: ["Cinnamon", "Clary Sage", "Caraway"],
    base: ["Black Vanilla Husk", "Amber", "Patchouli", "Cedar"],
    accords: [
      { name: "Vanilla", percentage: 90, color: "#FFF8E1" },
      { name: "Fruity", percentage: 80, color: "#F48FB1" },
      { name: "Aromatic", percentage: 75, color: "#A5D6A7" },
      { name: "Sweet", percentage: 70, color: "#FFB74D" },
      { name: "Cinnamon", percentage: 65, color: "#D84315" }
    ]
  },
  {
    name: "Bad Boy", brand: "Carolina Herrera", gender: "MEN", family: "SPICY",
    desc: "A striking interplay between darkness and light, combining crisp pepper and bergamot with deep roasted cacao and warm tonka bean.",
    top: ["Black Pepper", "White Pepper", "Italian Green Bergamot"],
    mid: ["Cedarwood", "Sage"],
    base: ["Tonka Bean", "Cacao", "Amberwood"],
    accords: [
      { name: "Warm Spicy", percentage: 85, color: "#D84315" },
      { name: "Fresh Spicy", percentage: 75, color: "#9CCC65" },
      { name: "Cacao", percentage: 70, color: "#4E342E" },
      { name: "Aromatic", percentage: 65, color: "#80CBC4" }
    ]
  },
  {
    name: "Emporio Armani Stronger With You Parfum", brand: "Giorgio Armani", gender: "MEN", family: "ORIENTAL",
    desc: "An opulent, sensual composition centered around sweet glazed chestnut and smooth bourbon vanilla, grounded by warm aromatic spices and soft leather.",
    top: ["Pink Pepper", "Cardamom", "Violet Leaves"],
    mid: ["Lavender", "Sage"],
    base: ["Chestnut", "Bourbon Vanilla", "Cedar", "Leather"],
    accords: [
      { name: "Vanilla", percentage: 90, color: "#FFE082" },
      { name: "Lavender", percentage: 80, color: "#CE93D8" },
      { name: "Soft Spicy", percentage: 75, color: "#FFAB91" },
      { name: "Nutty", percentage: 65, color: "#BCAAA4" }
    ]
  },
  {
    name: "Valentino Donna", brand: "Valentino", gender: "WOMEN", family: "FLORAL",
    desc: "A luminous, elegant fragrance pairing powdery iris and classic rose with a rich, smooth backdrop of soft leather and sweet vanilla.",
    top: ["Italian Bergamot"],
    mid: ["Iris", "Bulgarian Rose"],
    base: ["Leather", "Vanilla", "Patchouli"],
    accords: [
      { name: "Iris", percentage: 90, color: "#E1BEE7" },
      { name: "Rose", percentage: 85, color: "#F48FB1" },
      { name: "Leather", percentage: 75, color: "#8D6E63" },
      { name: "Vanilla", percentage: 65, color: "#FFF59D" }
    ]
  },
  {
    name: "Sexy Secret", brand: "Jean Marc Paris", gender: "WOMEN", family: "GOURMAND",
    desc: "A playful and seductive floral-fruity gourmand blending sweet berries and almond blossoms with creamy vanilla and smooth sandalwood.",
    top: ["Pink Berries", "Mandarin", "Sparkling Plum"],
    mid: ["Pink Rose", "Jasmine", "Almond Blossom"],
    base: ["Creamy Vanilla", "Sandalwood", "Amber"],
    accords: [
      { name: "Sweet", percentage: 90, color: "#FF80AB" },
      { name: "Fruity", percentage: 85, color: "#FF4081" },
      { name: "Vanilla", percentage: 80, color: "#FFF176" }
    ]
  },
  {
    name: "Bombshell", brand: "Victoria's Secret", gender: "WOMEN", family: "FLORAL",
    desc: "America’s signature scent—a sparkling cocktail of fresh-cut Shangri-La peonies, exotic passionfruit, and bright tropical berries.",
    top: ["Passionfruit", "Grapefruit", "Pineapple", "Strawberry", "Big Strawberry"],
    mid: ["Peony", "Vanilla Orchid", "Red Berries", "Jasmine", "Lily-of-the-Valley"],
    base: ["Musk", "Woody Notes", "Oakmoss"],
    accords: [
      { name: "Fruity", percentage: 95, color: "#F06292" },
      { name: "Sweet", percentage: 85, color: "#FF8A80" },
      { name: "Fresh", percentage: 80, color: "#80DEEA" }
    ]
  },
  {
    name: "Mon Guerlain", brand: "Guerlain", gender: "WOMEN", family: "FLORAL",
    desc: "A tribute to modern femininity—combining fresh, clean Carla lavender with rich Tahitian vanilla and creamy sandalwood.",
    top: ["Carla Lavender", "Bergamot"],
    mid: ["Jasmine Sambac", "Iris", "Rose"],
    base: ["Tahitensis Vanilla", "Coumarin", "Australian Sandalwood", "Benzoin", "Patchouli"],
    accords: [
      { name: "Vanilla", percentage: 90, color: "#FFF59D" },
      { name: "Lavender", percentage: 85, color: "#D1C4E9" },
      { name: "Woody", percentage: 75, color: "#A1887F" }
    ]
  },
  {
    name: "Spicebomb Extreme", brand: "Viktor&Rolf", gender: "MEN", family: "SPICY",
    desc: "An explosive, warm explosion where fiery spices and rich tobacco leaf melt into a deep, comforting bourbon vanilla base.",
    top: ["Black Pepper", "Caraway"],
    mid: ["Cinnamon", "Saffron", "Tobacco"],
    base: ["Bourbon Vanilla", "Amber"],
    accords: [
      { name: "Vanilla", percentage: 90, color: "#FFE082" },
      { name: "Tobacco", percentage: 85, color: "#6D4C41" },
      { name: "Warm Spicy", percentage: 80, color: "#D84315" }
    ]
  },
  {
    name: "Y Eau de Parfum", brand: "Yves Saint Laurent", gender: "MEN", family: "FRESH",
    desc: "A modern, ultra-fresh fragrance blending crisp apple and ginger with aromatic sage over a deep, sensual amberwood base.",
    top: ["Apple", "Ginger", "Bergamot"],
    mid: ["Sage", "Juniper Berries", "Geranium"],
    base: ["Amberwood", "Tonka Bean", "Cedar", "Vetiver", "Olibanum"],
    accords: [
      { name: "Aromatic", percentage: 90, color: "#80CBC4" },
      { name: "Fresh Spicy", percentage: 85, color: "#AED581" },
      { name: "Woody", percentage: 75, color: "#8D6E63" }
    ]
  },
  {
    name: "Ehsas", brand: "Arabian Oud", gender: "MEN", family: "ORIENTAL",
    desc: "A captivating Oriental fragrance opening with bright citrus that gracefully unveils a delicate heart of rose, supported by rich amber.",
    top: ["Bergamot", "Citrus Accord"],
    mid: ["Rose", "Floral Notes"],
    base: ["Oud", "Amber", "Powdery Notes", "Cedarwood"],
    accords: [
      { name: "Woody", percentage: 85, color: "#795548" },
      { name: "Amber", percentage: 80, color: "#FFB300" },
      { name: "Citrus", percentage: 70, color: "#FFF176" }
    ]
  },
  {
    name: "Icon", brand: "Alfred Dunhill", gender: "MEN", family: "WOODY",
    desc: "A refined executive fragrance opening with zesty neroli and bergamot, leading to a spicy-aromatic heart and leather finish.",
    top: ["Neroli", "Bergamot", "Black Pepper", "Petitgrain"],
    mid: ["Black Pepper", "Lavender", "Cardamom", "Juniper Berries", "Sage"],
    base: ["Vetiver", "Oud", "Leather", "Oakmoss", "Iris"],
    accords: [
      { name: "Aromatic", percentage: 90, color: "#80CBC4" },
      { name: "Fresh Spicy", percentage: 80, color: "#C0CA33" },
      { name: "Citrus", percentage: 75, color: "#FFEB3B" }
    ]
  },
  {
    name: "Acqua di Giò Elixir", brand: "Giorgio Armani", gender: "MEN", family: "AQUATIC",
    desc: "An intense marine signature pairing oceanic freshness with rich woods and earthy leather for maximum presence.",
    top: ["Bergamot", "Marine Notes"],
    mid: ["Rosemary", "Clary Sage", "Geranium"],
    base: ["Patchouli", "Woody Notes", "Leather Accord"],
    accords: [
      { name: "Aquatic", percentage: 95, color: "#4FC3F7" },
      { name: "Citrus", percentage: 85, color: "#FFF176" },
      { name: "Ozonic", percentage: 80, color: "#E0F7FA" }
    ]
  },
  {
    name: "Sauvage Eau de Parfum", brand: "Dior", gender: "MEN", family: "FRESH",
    desc: "A sensual, mysterious fragrance contrasting raw bergamot freshness with warm Sichuan pepper, velvety lavender, and ambroxan.",
    top: ["Calabrian Bergamot"],
    mid: ["Sichuan Pepper", "Lavender", "Star Anise", "Nutmeg"],
    base: ["Ambroxan", "Vanilla"],
    accords: [
      { name: "Fresh Spicy", percentage: 90, color: "#AED581" },
      { name: "Citrus", percentage: 85, color: "#FFF59D" },
      { name: "Amber", percentage: 80, color: "#FFB74D" }
    ]
  },
  {
    name: "Eros Parfum", brand: "Versace", gender: "MEN", family: "FRESH",
    desc: "A heroic fragrance unleashing a burst of crisp green apple and mint wrapped in rich, creamy vanilla and vibrant woods.",
    top: ["Mint", "Green Apple", "Lemon"],
    mid: ["Tonka Bean", "Ambroxan", "Geranium"],
    base: ["Madagascar Vanilla", "Cedarwood", "Vetiver", "Oakmoss"],
    accords: [
      { name: "Aromatic", percentage: 90, color: "#4DB6AC" },
      { name: "Fresh Spicy", percentage: 85, color: "#9CCC65" },
      { name: "Amber", percentage: 80, color: "#FFB74D" }
    ]
  },
  {
    name: "MYSLF Eau de Parfum", brand: "Yves Saint Laurent", gender: "MEN", family: "FRESH",
    desc: "A modern statement of self-expression featuring a sparkling citrus opening, clean white floral heart, and warm patchouli base.",
    top: ["Calabrian Bergamot", "Bergamot"],
    mid: ["Tunisian Orange Blossom"],
    base: ["Ambrofix", "Patchouli"],
    accords: [
      { name: "Citrus", percentage: 90, color: "#FFEE58" },
      { name: "White Floral", percentage: 85, color: "#FAFAFA" },
      { name: "Patchouli", percentage: 75, color: "#6D4C41" }
    ]
  },
  {
    name: "Le Beau", brand: "Jean Paul Gaultier", gender: "MEN", family: "GOURMAND",
    desc: "An ultra-refreshing tropical escape opening with crisp bergamot and lush coconut wood, rounded out by rich tonka bean.",
    top: ["Bergamot"],
    mid: ["Coconut Wood"],
    base: ["Tonka Bean"],
    accords: [
      { name: "Coconut", percentage: 95, color: "#FFF9C4" },
      { name: "Vanilla", percentage: 85, color: "#FFF176" },
      { name: "Sweet", percentage: 80, color: "#FFB74D" }
    ]
  },
  {
    name: "Invictus Victory Elixir", brand: "Rabanne", gender: "MEN", family: "SPICY",
    desc: "A high-octane elixir blending aromatic lavender and fiery spices with deep, smoky incense and a powerful vanilla finish.",
    top: ["Cardamom", "Black Pepper", "Green Artemisia"],
    mid: ["Fresh Lavender", "Incense"],
    base: ["Rich Vanilla", "Tonka Bean", "Patchouli"],
    accords: [
      { name: "Vanilla", percentage: 90, color: "#FFE082" },
      { name: "Warm Spicy", percentage: 85, color: "#D84315" },
      { name: "Amber", percentage: 80, color: "#FFA000" }
    ]
  },
  {
    name: "1 Million Parfum", brand: "Rabanne", gender: "MEN", family: "ORIENTAL",
    desc: "A daring solar-leather creation that pairs creamy tuberose and tropical monoi oil with salty amber and smooth leather.",
    top: ["Salty Tuberose", "Pink Pepper"],
    mid: ["Monoi Oil", "Leather"],
    base: ["Solar Amber", "Cashmeran", "Labdanum"],
    accords: [
      { name: "White Floral", percentage: 90, color: "#F5F5F5" },
      { name: "Tuberose", percentage: 85, color: "#EDE7F6" },
      { name: "Amber", percentage: 80, color: "#FFB300" }
    ]
  },
  {
    name: "Silver Mountain Water", brand: "Creed", gender: "UNISEX", family: "FRESH",
    desc: "Inspired by the invigorating freshness of alpine air—combining sparkling citrus and crisp green tea with sweet blackcurrant.",
    top: ["Bergamot", "Mandarin Orange"],
    mid: ["Green Tea", "Blackcurrant"],
    base: ["Musk", "Petitgrain", "Sandalwood", "Galbanum"],
    accords: [
      { name: "Citrus", percentage: 90, color: "#FFF176" },
      { name: "Green", percentage: 85, color: "#A5D6A7" },
      { name: "Fruity", percentage: 80, color: "#F48FB1" }
    ]
  },
  {
    name: "Strawberry Letter", brand: "Phlur", gender: "WOMEN", family: "GOURMAND",
    desc: "A playful, nostalgic gourmand bursting with juicy strawberry nectar and red poppies, wrapped in warm sugared amber and tonka bean.",
    top: ["Cassis", "Strawberry", "Plum Nectar"],
    mid: ["Red Poppy", "Apple Blossom", "Wild Lily"],
    base: ["Tonka Bean", "Sugared Amber", "Earthy Woods"],
    accords: [
      { name: "Fruity", percentage: 95, color: "#FF1744" },
      { name: "Sweet", percentage: 90, color: "#FF4081" },
      { name: "Amber", percentage: 75, color: "#FFB300" }
    ]
  },
  {
    name: "Scandal Pour Homme", brand: "Jean Paul Gaultier", gender: "MEN", family: "GOURMAND",
    desc: "A knockout fragrance featuring a rich, addictive caramel core cut with fresh clary sage and mandarin, anchored by vetiver.",
    top: ["Clary Sage", "Mandarin Orange"],
    mid: ["Caramel", "Tonka Bean"],
    base: ["Vetiver"],
    accords: [
      { name: "Caramel", percentage: 95, color: "#FB8C00" },
      { name: "Aromatic", percentage: 85, color: "#80CBC4" },
      { name: "Sweet", percentage: 80, color: "#FFE082" }
    ]
  },
  {
    name: "Eau de Lacoste L.12.12. White", brand: "Lacoste Fragrances", gender: "MEN", family: "FRESH",
    desc: "The essence of a crisp white polo shirt—clean grapefruit and aromatic rosemary combined with creamy tuberose and suede.",
    top: ["Grapefruit", "Rosemary", "Cardamom"],
    mid: ["Ylang-Ylang", "Tuberose"],
    base: ["Suede", "Leather", "Cedar", "Vetiver"],
    accords: [
      { name: "Woody", percentage: 85, color: "#8D6E63" },
      { name: "Citrus", percentage: 80, color: "#FFF59D" },
      { name: "Aromatic", percentage: 75, color: "#A5D6A7" }
    ]
  },
  {
    name: "Absolu Aventus", brand: "Creed", gender: "MEN", family: "WOODY",
    desc: "An exclusive, darker twist on the iconic Aventus profile—bursting with radiant citrus and warm spice over signature woods.",
    top: ["Grapefruit", "Bergamot", "Blackcurrant"],
    mid: ["Ginger", "Cinnamon", "Citron", "Cardamom"],
    base: ["Pink Pepper", "Patchouli", "Vetiver"],
    accords: [
      { name: "Citrus", percentage: 90, color: "#FFF176" },
      { name: "Warm Spicy", percentage: 85, color: "#E65100" },
      { name: "Woody", percentage: 80, color: "#6D4C41" }
    ]
  },
  {
    name: "Aventus", brand: "Creed", gender: "MEN", family: "WOODY",
    desc: "The legendary benchmark fragrance featuring a vibrant opening of juicy pineapple and apple over smoky birch and oakmoss.",
    top: ["Pineapple", "Bergamot", "Blackcurrant", "Apple"],
    mid: ["Birch", "Patchouli", "Moroccan Jasmine", "Rose"],
    base: ["Musk", "Oakmoss", "Ambergris", "Vanille"],
    accords: [
      { name: "Fruity", percentage: 90, color: "#FBC02D" },
      { name: "Sweet", percentage: 80, color: "#FFE082" },
      { name: "Woody", percentage: 75, color: "#795548" }
    ]
  },
  {
    name: "Angels' Share", brand: "By Kilian", gender: "UNISEX", family: "GOURMAND",
    desc: "A warm, boozy masterpiece opening with aged cognac and rich cinnamon, settling into a luscious base of praline and oak.",
    top: ["Cognac"],
    mid: ["Cinnamon", "Tonka Bean", "Oak"],
    base: ["Vanilla", "Praline", "Sandalwood"],
    accords: [
      { name: "Woody", percentage: 90, color: "#6D4C41" },
      { name: "Warm Spicy", percentage: 85, color: "#D84315" },
      { name: "Sweet", percentage: 80, color: "#FFA000" }
    ]
  },
  {
    name: "Chance Eau Tendre", brand: "Chanel", gender: "WOMEN", family: "FLORAL",
    desc: "A delicate, romantic fragrance blending crisp quince and grapefruit with a soft, radiant heart of jasmine and hyacinth.",
    top: ["Quince", "Grapefruit"],
    mid: ["Hyacinth", "Jasmine"],
    base: ["Musk", "Iris", "Virginia Cedar", "Amber"],
    accords: [
      { name: "Floral", percentage: 95, color: "#F8BBD0" },
      { name: "Fruity", percentage: 85, color: "#FF8A80" },
      { name: "Citrus", percentage: 75, color: "#FFF59D" }
    ]
  },
  {
    name: "Miss Dior Blooming Bouquet", brand: "Dior", gender: "WOMEN", family: "FLORAL",
    desc: "An enchanting floral bouquet capturing the freshness of newly bloomed peonies and roses, brightened by mandarin.",
    top: ["Sicilian Mandarin"],
    mid: ["Pink Peony", "Damask Rose", "Apricot", "Peach"],
    base: ["White Musk"],
    accords: [
      { name: "Floral", percentage: 95, color: "#F48FB1" },
      { name: "Rose", percentage: 85, color: "#E91E63" },
      { name: "Fresh", percentage: 80, color: "#80DEEA" }
    ]
  },
  {
    name: "Lady Korloff", brand: "Korloff Paris", gender: "WOMEN", family: "FLORAL",
    desc: "An opulent, radiant white floral fragrance featuring luminous tuberose and orange blossom, grounded by warm sandalwood.",
    top: ["Orange", "Mandarin Orange", "Pear"],
    mid: ["Tuberose", "Jasmine", "African Orange Flower"],
    base: ["Musk", "Sandalwood", "Virginia Cedar"],
    accords: [
      { name: "White Floral", percentage: 90, color: "#FAFAFA" },
      { name: "Citrus", percentage: 80, color: "#FFF176" },
      { name: "Tuberose", percentage: 75, color: "#EDE7F6" }
    ]
  },
  {
    name: "Bright Peach", brand: "Maison Alhambra", gender: "UNISEX", family: "GOURMAND",
    desc: "A juicy, intoxicating gourmand scent exploding with ripe nectarous peach and blood orange, enriched by honeyed cognac.",
    top: ["Peach", "Blood Orange", "Cardamom"],
    mid: ["Rum", "Cognac", "Davana", "Jasmine"],
    base: ["Indonesian Patchouli Leaf", "Vanilla", "Sandalwood", "Tonka Bean", "Benzoin", "Cashmeran", "Vetiver", "Labdanum"],
    accords: [
      { name: "Fruity", percentage: 95, color: "#FF8A65" },
      { name: "Sweet", percentage: 85, color: "#FFB74D" },
      { name: "Honey", percentage: 80, color: "#FFD54F" }
    ]
  },
  {
    name: "Libre", brand: "Yves Saint Laurent", gender: "WOMEN", family: "FLORAL",
    desc: "A grand floral fragrance contrasting burning Moroccan orange blossom and bold French lavender with a sensual vanilla-musk base.",
    top: ["Lavender", "Mandarin Orange", "Blackcurrant", "Petitgrain"],
    mid: ["Lavender", "Orange Blossom", "Jasmine"],
    base: ["Madagascar Vanilla", "Musk", "Cedar", "Ambergris"],
    accords: [
      { name: "White Floral", percentage: 90, color: "#F5F5F5" },
      { name: "Citrus", percentage: 85, color: "#FFF59D" },
      { name: "Lavender", percentage: 80, color: "#CE93D8" }
    ]
  },
  {
    name: "J'adore Parfum d'Eau", brand: "Dior", gender: "WOMEN", family: "FLORAL",
    desc: "An innovative water-based fragrance bursting with fresh white florals—luminous neroli, rich jasmine, and delicate magnolia.",
    top: ["Neroli", "Green Notes"],
    mid: ["Jasmine Sambac", "Chinese Magnolia"],
    base: ["Neroli", "Rose"],
    accords: [
      { name: "White Floral", percentage: 95, color: "#FAFAFA" },
      { name: "Floral", percentage: 90, color: "#F8BBD0" },
      { name: "Green", percentage: 80, color: "#C8E6C9" }
    ]
  },
  {
    name: "Flora Gorgeous Gardenia", brand: "Gucci", gender: "WOMEN", family: "FLORAL",
    desc: "A joyful floral potion built around white gardenia flower, blended with solar jasmine absolute and sweet pear blossom.",
    top: ["Pear Blossom", "Red Berries", "Italian Mandarin"],
    mid: ["Gardenia", "Jasmine", "Frangipani"],
    base: ["Brown Sugar", "Patchouli"],
    accords: [
      { name: "White Floral", percentage: 90, color: "#FFFFFF" },
      { name: "Floral", percentage: 85, color: "#F48FB1" },
      { name: "Sweet", percentage: 80, color: "#FFE082" }
    ]
  },
  {
    name: "Black Opium", brand: "Yves Saint Laurent", gender: "WOMEN", family: "GOURMAND",
    desc: "An addictive, highly energizing gourmand fragrance pairing rich black coffee and sweet vanilla with soft white florals.",
    top: ["Pear", "Pink Pepper", "Orange Blossom"],
    mid: ["Coffee", "Jasmine", "Bitter Almond", "Licorice"],
    base: ["Vanilla", "Patchouli", "Cedar", "Cashmere Wood"],
    accords: [
      { name: "Vanilla", percentage: 95, color: "#FFF9C4" },
      { name: "Coffee", percentage: 90, color: "#3E2723" },
      { name: "Sweet", percentage: 85, color: "#FFB74D" }
    ]
  },
  {
    name: "Bleu de Chanel", brand: "Chanel", gender: "MEN", family: "FRESH",
    desc: "The benchmark of modern male elegance—combining crisp citrus with smoky incense and rich cedarwood for an unmistakable signature.",
    top: ["Grapefruit", "Lemon", "Mint", "Pink Pepper"],
    mid: ["Ginger", "Nutmeg", "Jasmine", "Iso E Super"],
    base: ["Incense", "Vetiver", "Cedar", "Sandalwood", "Patchouli", "Labdanum"],
    accords: [
      { name: "Citrus", percentage: 90, color: "#FFF176" },
      { name: "Woody", percentage: 85, color: "#795548" },
      { name: "Fresh Spicy", percentage: 80, color: "#AED581" }
    ]
  },
  {
    name: "Million Gold For Her", brand: "Rabanne", gender: "WOMEN", family: "FLORAL",
    desc: "A dazzling, gilded floral fragrance blending radiant yellow ylang-ylang and intoxicating white florals with sweet vanilla.",
    top: ["Rose", "White Flowers", "Mandarin"],
    mid: ["Ylang-Ylang", "Jasmine", "Solar Notes"],
    base: ["Vanilla", "Musk", "Mineral Accord", "Moss"],
    accords: [
      { name: "Sweet", percentage: 90, color: "#FFD54F" },
      { name: "Vanilla", percentage: 85, color: "#FFF59D" },
      { name: "Yellow Floral", percentage: 80, color: "#FFEE58" }
    ]
  },
  {
    name: "Paradoxe", brand: "Prada", gender: "WOMEN", family: "FLORAL",
    desc: "An iconic signature reinventing floral freshness with a burst of zesty citrus, luminous neroli, and warm amber-vanilla infusion.",
    top: ["Pear", "Tangerine", "Bergamot"],
    mid: ["Orange Blossom", "Neroli Essence", "Neroli", "Jasmine Sambac"],
    base: ["Bourbon Vanilla", "Amber", "White Musk", "Benzoin"],
    accords: [
      { name: "White Floral", percentage: 90, color: "#FAFAFA" },
      { name: "Citrus", percentage: 85, color: "#FFF59D" },
      { name: "Sweet", percentage: 80, color: "#FFB74D" }
    ]
  },
  {
    name: "Girl of Now", brand: "Elie Saab", gender: "WOMEN", family: "GOURMAND",
    desc: "A luscious gourmand scent combining crunchy roasted pistachio and sweet pear with creamy almond milk and warm tonka.",
    top: ["Roasted Pistachio", "Pear", "Mandarin Orange"],
    mid: ["Almond", "Orange Blossom", "Magnolia"],
    base: ["Almond Milk", "Tonka Bean", "Patchouli", "Cashmeran"],
    accords: [
      { name: "Almond", percentage: 90, color: "#D7CCC8" },
      { name: "Sweet", percentage: 85, color: "#FFE082" },
      { name: "Nutty", percentage: 80, color: "#BCAAA4" }
    ]
  },
  {
    name: "Narciso Rodriguez for Her Eau de Parfum", brand: "Narciso Rodriguez", gender: "WOMEN", family: "FLORAL",
    desc: "An intimate, velvety signature featuring rose and juicy peach wrapped around a central core of sensual musk and patchouli.",
    top: ["Rose", "Peach"],
    mid: ["Musk", "Amber"],
    base: ["Patchouli", "Sandalwood"],
    accords: [
      { name: "Musky", percentage: 90, color: "#ECEFF1" },
      { name: "Rose", percentage: 85, color: "#F48FB1" },
      { name: "Powdery", percentage: 80, color: "#F5F5F5" }
    ]
  },
  {
    name: "Good Girl", brand: "Carolina Herrera", gender: "WOMEN", family: "GOURMAND",
    desc: "A bold fragrance contrasting bright white florals like tuberose and jasmine with dark notes of roasted tonka bean and cacao.",
    top: ["Almond", "Coffee", "Bergamot", "Lemon"],
    mid: ["Tuberose", "Jasmine Sambac", "Orange Blossom", "Orris", "Bulgarian Rose"],
    base: ["Tonka Bean", "Cacao", "Vanilla", "Praline", "Sandalwood", "Amber", "Musk", "Cashmere Wood", "Cinnamon", "Patchouli", "Cedar"],
    accords: [
      { name: "Sweet", percentage: 90, color: "#FFB74D" },
      { name: "White Floral", percentage: 85, color: "#FAFAFA" },
      { name: "Warm Spicy", percentage: 80, color: "#D84315" }
    ]
  },
  {
    name: "Burberry Her", brand: "Burberry", gender: "WOMEN", family: "GOURMAND",
    desc: "A vibrant burst-of-berries scent capturing the spirit of London—sweet red berries softened by powdery violet and musk.",
    top: ["Strawberry", "Raspberry", "Blackberry", "Sour Cherry", "Blackcurrant"],
    mid: ["Violet", "Jasmine"],
    base: ["Musk", "Vanilla", "Cashmeran", "Woody Notes", "Amber"],
    accords: [
      { name: "Fruity", percentage: 95, color: "#E91E63" },
      { name: "Sweet", percentage: 85, color: "#F48FB1" },
      { name: "Woody", percentage: 75, color: "#8D6E63" }
    ]
  },
  {
    name: "Japanese Cherry Blossom", brand: "Bath & Body Works", gender: "WOMEN", family: "FLORAL",
    desc: "A graceful floral fragrance blending sweet cherry blossom, crisp Asian pear, and warm vanilla rice.",
    top: ["Asian Pear", "Fuji Apple", "Plum"],
    mid: ["Japanese Cherry Blossom", "Kyoto Rose", "Mimosa", "Tuberose"],
    base: ["Vanilla Rice", "Imperial Amber", "Silk Musk", "Sandalwood"],
    accords: [
      { name: "Floral", percentage: 90, color: "#F8BBD0" },
      { name: "Fruity", percentage: 85, color: "#FF8A80" },
      { name: "Powdery", percentage: 80, color: "#FAFAFA" }
    ]
  },
  {
    name: "Dior Homme Parfum", brand: "Dior", gender: "MEN", family: "WOODY",
    desc: "A sophisticated, dark, and regal fragrance built around powdery Tuscan iris and smooth leather.",
    top: ["Tuscan Iris", "Italian Orange"],
    mid: ["Leather", "Violet"],
    base: ["Agarwood (Oud)", "Cedar", "Sandalwood"],
    accords: [
      { name: "Amber", percentage: 90, color: "#FFA000" },
      { name: "Woody", percentage: 85, color: "#6D4C41" },
      { name: "Earthy", percentage: 80, color: "#5D4037" }
    ]
  },
  {
    name: "Terre d'Hermès Parfum", brand: "Hermès", gender: "MEN", family: "FRESH",
    desc: "An earthy, mineral-rich masterpiece contrasting sparkling grapefruit and citrus with warm flint, oakmoss, and noble woods.",
    top: ["Grapefruit", "Orange"],
    mid: ["Flint", "Mineral Notes"],
    base: ["Woody Notes", "Oakmoss", "Benzoin"],
    accords: [
      { name: "Citrus", percentage: 90, color: "#FFF176" },
      { name: "Woody", percentage: 85, color: "#795548" },
      { name: "Mossy", percentage: 80, color: "#558B2F" }
    ]
  },
  {
    name: "Olympéa Blossom", brand: "Rabanne", gender: "WOMEN", family: "FLORAL",
    desc: "A divine, sparkling floral-fruity scent balancing sweet sorbet pear and blooming roses with salted vanilla.",
    top: ["Damask Rose", "Pink Pepper"],
    mid: ["Pear", "Black Sorbet", "Blackcurrant"],
    base: ["Vanilla", "Salt", "Cashmeran", "Patchouli"],
    accords: [
      { name: "Fruity", percentage: 90, color: "#FF8A80" },
      { name: "Rose", percentage: 85, color: "#F48FB1" },
      { name: "Sweet", percentage: 80, color: "#FFE082" }
    ]
  },
  {
    name: "Millésime Impérial", brand: "Creed", gender: "UNISEX", family: "AQUATIC",
    desc: "A golden citrus-marine fragrance evoking sun-drenched palace gardens overlooking the sea—refreshing and luxurious.",
    top: ["Fruity Notes", "Sea Salt"],
    mid: ["Sicilian Lemon", "Bergamot", "Iris", "Mandarin Orange"],
    base: ["Sea Notes", "Musk", "Woody Notes"],
    accords: [
      { name: "Marine", percentage: 95, color: "#4FC3F7" },
      { name: "Citrus", percentage: 85, color: "#FFF176" },
      { name: "Salty", percentage: 80, color: "#E0F7FA" }
    ]
  },
  {
    name: "Sì Parfum", brand: "Giorgio Armani", gender: "WOMEN", family: "FLORAL",
    desc: "An opulent, passionate fragrance combining dark blackcurrant nectar and velvet rose with rich leather and bourbon vanilla.",
    top: ["Blackcurrant Nectar", "Saffron"],
    mid: ["Damask Rose"],
    base: ["Bourbon Vanilla", "Leather Accord", "Patchouli"],
    accords: [
      { name: "Fruity", percentage: 90, color: "#AD1457" },
      { name: "Leather", percentage: 80, color: "#6D4C41" },
      { name: "Vanilla", percentage: 75, color: "#FFE082" }
    ]
  },
  {
    name: "Rose Noir", brand: "Byredo", gender: "UNISEX", family: "FLORAL",
    desc: "An enigmatic, dark rose fragrance where traditional romantic rose is given an earthy, mossy depth with hints of crisp grapefruit.",
    top: ["Grapefruit", "Freesia", "Cardamom"],
    mid: ["Damask Rose", "Violet", "Jasmine"],
    base: ["Oakmoss", "Musk", "Labdanum"],
    accords: [
      { name: "Rose", percentage: 95, color: "#C2185B" },
      { name: "Mossy", percentage: 80, color: "#33691E" },
      { name: "Floral", percentage: 75, color: "#F48FB1" }
    ]
  },
  {
    name: "Gucci Bloom", brand: "Gucci", gender: "WOMEN", family: "FLORAL",
    desc: "A lush, rich white floral garden in full bloom—celebrating natural tuberose and jasmine for a clean, authentic scent.",
    top: ["Jasmine", "Green Accords"],
    mid: ["Tuberose", "Natural Jasmine Sambac"],
    base: ["Rangoon Creeper", "Sandalwood"],
    accords: [
      { name: "White Floral", percentage: 95, color: "#FFFFFF" },
      { name: "Tuberose", percentage: 85, color: "#EDE7F6" },
      { name: "Floral", percentage: 80, color: "#F8BBD0" }
    ]
  },
  {
    name: "Explorer Platinum", brand: "Montblanc", gender: "MEN", family: "FRESH",
    desc: "A crisp, metallic-woody fragrance inspired by mountain exploration—fresh violet leaves and herbal sage over clean cedarwood.",
    top: ["Violet Leaves"],
    mid: ["Clary Sage"],
    base: ["Cedarwood"],
    accords: [
      { name: "Woody", percentage: 90, color: "#795548" },
      { name: "Aromatic", percentage: 85, color: "#80CBC4" },
      { name: "Ozonic", percentage: 80, color: "#B2EBF2" }
    ]
  },
  {
    name: "Good Girl Blush", brand: "Carolina Herrera", gender: "WOMEN", family: "FLORAL",
    desc: "A charming explosion of romantic florals grounded by sweet vanilla and powdery bitter almond.",
    top: ["Italian Bergamot", "Bitter Almond"],
    mid: ["Ylang-Ylang", "Peony"],
    base: ["Vanilla", "Coumarin"],
    accords: [
      { name: "Floral", percentage: 90, color: "#F48FB1" },
      { name: "Vanilla", percentage: 85, color: "#FFF59D" },
      { name: "Fresh", percentage: 80, color: "#E0F7FA" }
    ]
  },
  {
    name: "Good Girl Gone Bad", brand: "By Kilian", gender: "WOMEN", family: "FLORAL",
    desc: "A luscious floral whirlwind opening with sweet jasmine and osmanthus before surrendering to intense tuberose and warm cedarwood.",
    top: ["Jasmine", "May Rose", "Osmanthus"],
    mid: ["Indian Tuberose", "Narcissus"],
    base: ["Amber", "Cedar"],
    accords: [
      { name: "White Floral", percentage: 95, color: "#FAFAFA" },
      { name: "Fruity", percentage: 85, color: "#FF8A80" },
      { name: "Floral", percentage: 80, color: "#F8BBD0" }
    ]
  },
  {
    name: "Vanilla 28", brand: "Kayali", gender: "UNISEX", family: "GOURMAND",
    desc: "A rich, warm gourmand masterpiece blending sweet brown sugar and tonka bean with velvety vanilla orchid and deep royal amber.",
    top: ["Vanilla Orchid", "Jasmine"],
    mid: ["Tonka Bean", "Brown Sugar"],
    base: ["Amber", "Musk", "Patchouli", "Royal Amber"],
    accords: [
      { name: "Vanilla", percentage: 95, color: "#FFF59D" },
      { name: "Sweet", percentage: 90, color: "#FFD54F" },
      { name: "Amber", percentage: 80, color: "#FFB300" }
    ]
  }
];

const existingPath = path.join(__dirname, '../data/products.json');
let existingData = [];
if (fs.existsSync(existingPath)) {
  existingData = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
}

const mappedNormal = normalPerfumes.map((p, idx) => {
  const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const fileName = slug.replace(/-/g, '_');
  return {
    id: `prod-normal-${idx + 1}`,
    slug: slug,
    name: p.name,
    brand: p.brand,
    description: p.desc,
    rating: 4.8 + Math.round((idx % 3) * 0.1 * 10) / 10,
    reviewCount: 20 + ((idx * 3) % 45),
    image: `/images/products/${fileName}.jpg`,
    family: p.family,
    gender: p.gender,
    occasion: p.gender === 'MEN' ? 'Daily & Executive' : (p.gender === 'WOMEN' ? 'Romantic & Daytime' : 'Versatile'),
    meter: idx % 2 === 0 ? 'LONG_LASTING' : 'BEAST_MODE',
    isActive: true,
    priceVal: 300,
    sizes: [
      { size: "6ml", price: 300, originalPrice: 400, stock: 50 },
      { size: "10ml", price: 500, originalPrice: 650, stock: 50 },
      { size: "30ml", price: 900, originalPrice: 1100, stock: 35 },
      { size: "50ml", price: 1500, originalPrice: 1850, stock: 25 }
    ],
    notes: [
      ...p.top.map(n => ({ name: n, type: "TOP" })),
      ...p.mid.map(n => ({ name: n, type: "MIDDLE" })),
      ...p.base.map(n => ({ name: n, type: "BASE" }))
    ],
    accords: p.accords
  };
});

// Combine expensive (first 11 if present) and new normal perfumes (52)
const expensivePerfumes = existingData.slice(0, 11);
const allProducts = [...expensivePerfumes, ...mappedNormal];

fs.writeFileSync(existingPath, JSON.stringify(allProducts, null, 2));
console.log('Successfully wrote', allProducts.length, 'total products to Backend/data/products.json');
