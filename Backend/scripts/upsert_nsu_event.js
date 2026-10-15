const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const eventData = {
    slug: 'murakkaz-coming-to-nsu-yes-club',
    title: 'Murakkaz Coming to NSU — YES! Club Exhibition',
    description: `Murakkaz is coming to North South University (NSU)!

Organized in collaboration with the Young Entrepreneurs Society (YES! Club), we warmly invite all students, faculty members, and fragrance lovers to experience our premium collection of concentrated, long-lasting luxury perfumes.

Discover signature inspired masterpieces including Poison Girl, Montale (Arabians Tonka & Roses Musk), YSL Libre & MYSLF, Tom Ford Vanille Fatale, Miss Dior, 212 VIP Men, Kilian, KAYALI, and Burberry Her—handcrafted with extra pure fragrance oils for rich projection and all-day longevity.

Enjoy complimentary fragrance testing, personal scent consultations, and exclusive campus student discounts!

Event Details:
• Dates: October 23rd – 25th, 2026
• Timing: 9:00 AM – 6:00 PM Daily
• Venue: North South University (NSU), Plot # 15, Block # B, Bashundhara R/A, Dhaka
• Partner: Young Entrepreneurs Society (YES! Club)
• Inquiries & Hotline: 01997-807701
• Official Website: www.murakkaz.com`,
    image: '/images/events/murakkaz_nsu_yes_october_2026.png',
    day: '23',
    month: 'OCT',
    time: '9:00 AM - 6:00 PM',
    location: 'North South University (NSU), Bashundhara R/A, Dhaka',
    daysLeft: 7,
    eventDate: new Date('2026-10-23T09:00:00.000Z'),
    category: 'Campus Exhibition',
    isUpcoming: true,
  };

  const event = await prisma.event.upsert({
    where: { slug: eventData.slug },
    update: eventData,
    create: {
      id: 'cmue-nsu-yes-oct-2026',
      ...eventData,
    },
  });

  console.log('Successfully upserted NSU event:', event.id, event.title);

  // Mark older past event as not upcoming if it exists
  await prisma.event.updateMany({
    where: {
      slug: 'murakkaz-at-ronginee-exhibition-midas-centre',
    },
    data: {
      isUpcoming: false,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
