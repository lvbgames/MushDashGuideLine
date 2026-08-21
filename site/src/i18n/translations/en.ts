import type { ContactCategory } from '../../types/contact';
import type { TeamResponsibility, TeamRole } from '../../types/team';

export interface GameDetailTranslation {
  heroEyebrow: string;
  heroDescription: string;
  creatorLabel: string;
  genreLabel: string;
  overviewEyebrow: string;
  overviewTitle: string;
  overviewParagraphs: readonly string[];
  featuresEyebrow: string;
  featuresTitle: string;
  features: ReadonlyArray<{ title: string; description: string }>;
  featuredScreenshotEyebrow: string;
  featuredScreenshotTitle: string;
  galleryEyebrow: string;
  galleryTitle: string;
  screenshotAlts: readonly string[];
  purchaseEyebrow: string;
  purchaseTitle: string;
  purchaseDescription: string;
  moreGamesEyebrow: string;
  moreGamesTitle: string;
  moreGameDescription: string;
  moreGameCta: string;
}

export interface Translation {
  meta: {
    homeTitle: string;
    homeDescription: string;
    gamesTitle: string;
    gamesDescription: string;
    aboutTitle: string;
    aboutDescription: string;
    contactTitle: string;
    contactDescription: string;
    mushHeroTitle: string;
    mushHeroDescription: string;
    mushDashTitle: string;
    mushDashDescription: string;
    newsTitle: string;
    newsDescription: string;
  };
  nav: {
    games: string;
    about: string;
    news: string;
    follow: string;
    contact: string;
    primaryLabel: string;
    mobileLabel: string;
    toggleMenu: string;
    language: string;
  };
  common: {
    wishlistSteam: string;
    viewSteam: string;
    steam: string;
    epic: string;
    viewEpic: string;
    exploreGame: string;
    earlyAccess: string;
    coming2027: string;
    available: string;
    privacy: string;
    terms: string;
    opensNewTab: string;
    mediaUnavailable: string;
  };
  home: {
    heroEyebrow: string;
    heroDescription: string;
    heroSecondary: string;
    featuredEyebrow: string;
    featuredTitle: string;
    featuredTitleLines?: readonly string[];
    featuredDescription: string;
    features: ReadonlyArray<{ title: string; description: string }>;
    screenshotsLabel: string;
    gamesEyebrow: string;
    gamesTitle: string;
    gamesDescription: string;
    primaryGame: string;
    releasedGame: string;
    dashEyebrow: string;
    dashTitle: string;
    dashDescription: string;
    dashDetailCta: string;
    aboutEyebrow: string;
    aboutTitle: string;
    aboutDescription: string;
    aboutCta: string;
    followEyebrow: string;
    followTitle: string;
    followDescription: string;
    followLinks: {
      x: { description: string; action: string };
      instagram: { description: string; action: string };
      discord: { description: string; action: string };
      'steam-developer': { description: string; action: string };
    };
    contactEyebrow: string;
    contactTitle: string;
    contactDescription: string;
    contactCta: string;
  };
  gamesPage: {
    heroEyebrow: string;
    heroTitle: string;
    heroTitleLines?: readonly string[];
    heroDescription: string;
    featuredEyebrow: string;
    featuredDescription: string;
    releasedEyebrow: string;
    releasedDescription: string;
    detailCta: string;
    gameImageAlts: {
      mushhero: string;
      mushdash: string;
    };
    principlesEyebrow: string;
    principlesTitle: string;
    principlesDescription: string;
    principles: ReadonlyArray<{ title: string; description: string }>;
    contactEyebrow: string;
    contactTitle: string;
    contactDescription: string;
    contactCta: string;
  };
  about: {
    heroEyebrow: string;
    heroTitle: string;
    heroTitleLines?: readonly string[];
    heroDescription: string;
    logoAlt: string;
    capabilitiesEyebrow: string;
    capabilitiesTitle: string;
    capabilitiesTitleLines?: readonly string[];
    capabilities: ReadonlyArray<{ title: string; description: string }>;
    approachEyebrow: string;
    approachTitle: string;
    approachDescription: string;
    approach: ReadonlyArray<{ title: string; description: string }>;
    team: {
      eyebrow: string;
      title: string;
      description: string;
      responsibilitiesLabel: string;
      roles: Readonly<Record<TeamRole, string>>;
      responsibilities: Readonly<Record<TeamResponsibility, string>>;
      profileAlt: string;
    };
    locationEyebrow: string;
    locationTitle: string;
    locationDescription: string;
    mapTitle: string;
    mapCta: string;
    contactEyebrow: string;
    contactTitle: string;
    contactDescription: string;
    contactCta: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    categoriesTitle: string;
    categories: Readonly<Record<ContactCategory, string>>;
    guidanceTitle: string;
    creatorTitle: string;
    creatorDescription: string;
    creatorCta: string;
    pressTitle: string;
    pressDescription: string;
    pressCta: string;
    emailEyebrow: string;
    emailTitle: string;
    emailDescription: string;
    emailCta: string;
    emailAddressLabel: string;
    emailNotice: string;
    mailtoSubject: string;
    mailtoBodyTemplate: string;
    supportTitle: string;
    supportNote: string;
    supportCta: string;
  };
  news: {
    heroEyebrow: string;
    heroTitle: string;
    heroDescription: string;
    allEyebrow: string;
    allTitle: string;
    kindLabels: {
      interview: string;
      'press-coverage': string;
      'blog-review': string;
      feature: string;
    };
    sourceCta: string;
    followEyebrow: string;
    followTitle: string;
    followDescription: string;
  };
  mushHero: GameDetailTranslation;
  mushDash: GameDetailTranslation;
  footer: {
    tagline: string;
    navigationLabel: string;
    copyright: string;
  };
}

export const en: Translation = {
  meta: {
    homeTitle: 'Lv.B — Indie Game Studio in Busan, Korea',
    homeDescription: 'Lv.B is a Busan indie game studio creating MushHero and Mush Dash.',
    gamesTitle: 'Our Games — Lv.B',
    gamesDescription: 'Explore MushHero and Mush Dash, two distinctive multiplayer worlds created by indie game studio Lv.B.',
    aboutTitle: 'About Lv.B — Independent Game Studio',
    aboutDescription: 'Meet Lv.B, a Busan-based indie game studio creating approachable multiplayer games set in distinctive worlds.',
    contactTitle: 'Business Contact — Lv.B',
    contactDescription: 'Email Lv.B about business, partnerships, events, creators and Steam Curators, press, interviews and other company matters.',
    mushHeroTitle: 'MushHero — Cooperative Roguelite Defense | Lv.B',
    mushHeroDescription: 'Explore MushHero, a cooperative roguelite defense game about fighting monster waves, shaping new builds and defending together.',
    mushDashTitle: 'Mush Dash — Online Party Racing | Lv.B',
    mushDashDescription: 'Race through deadly obstacle courses with up to seven players in Mush Dash, an online party racing game available in Early Access.',
    newsTitle: 'News & Press — Lv.B',
    newsDescription: 'Read verified interviews, coverage and features about Lv.B, MushHero and Mush Dash.'
  },
  nav: {
    games: 'Games',
    about: 'About',
    news: 'News',
    follow: 'Follow Us',
    contact: 'Contact',
    primaryLabel: 'Primary navigation',
    mobileLabel: 'Mobile navigation',
    toggleMenu: 'Open or close navigation',
    language: 'Language'
  },
  common: {
    wishlistSteam: 'Wishlist on Steam',
    viewSteam: 'View on Steam',
    steam: 'Steam',
    epic: 'Epic Games Store',
    viewEpic: 'View on Epic Games Store',
    exploreGame: 'View game',
    earlyAccess: 'Early Access',
    coming2027: 'Coming 2027',
    available: 'Available now',
    privacy: 'Privacy',
    terms: 'Terms',
    opensNewTab: 'opens in a new tab',
    mediaUnavailable: 'Game image unavailable'
  },
  home: {
    heroEyebrow: 'Next from Lv.B',
    heroDescription: 'Defend together, shape your build and discover a different strategy every run.',
    heroSecondary: 'View MushHero',
    featuredEyebrow: 'Cooperative roguelite defense',
    featuredTitle: 'Build a new answer to every wave.',
    featuredDescription: 'Fight through waves of monsters and powerful bosses together. Randomized weapons, evolving skills and branching progression make each run your own.',
    features: [
      { title: 'Fight together', description: 'Combine roles and strategies against monster waves and powerful bosses.' },
      { title: 'Shape every run', description: 'Randomized weapons and evolving skills change how each battle unfolds.' },
      { title: 'Choose your path', description: 'Node-based progression opens different routes to a build that fits your playstyle.' }
    ],
    screenshotsLabel: 'MushHero screenshots',
    gamesEyebrow: 'From our studio',
    gamesTitle: 'Our Games',
    gamesDescription: 'Distinctive multiplayer worlds created by Lv.B.',
    primaryGame: 'Featured game',
    releasedGame: 'Released game',
    dashEyebrow: 'Out now in Early Access',
    dashTitle: 'Run fast. Read the traps. Claim the crown.',
    dashDescription: 'Race online with up to seven players, dodge deadly traps and collect Mushroom Coins on the way to the finish.',
    dashDetailCta: 'View Mush Dash',
    aboutEyebrow: 'From Busan, South Korea',
    aboutTitle: 'Games to laugh, connect and grow together.',
    aboutDescription: 'Lv.B is an indie game studio based in Busan. We create approachable multiplayer games set in distinctive worlds—experiences designed to stay with players long after the session ends.',
    aboutCta: 'About Lv.B',
    followEyebrow: 'Community',
    followTitle: 'Follow Lv.B',
    followDescription: 'Follow official Lv.B channels for studio updates, game news and community support.',
    followLinks: {
      x: { description: 'Short studio updates and announcements.', action: 'Follow on X' },
      instagram: { description: 'Visual updates from the studio and our games.', action: 'View Instagram' },
      discord: { description: 'Join the community for game discussion and support.', action: 'Join Discord' },
      'steam-developer': { description: 'Browse Lv.B games and developer updates on Steam.', action: 'View on Steam' }
    },
    contactEyebrow: 'Work with us',
    contactTitle: 'Let’s start a conversation.',
    contactDescription: 'For partnerships, events and exhibitions, creators and Steam Curators, press, interviews and general business inquiries.',
    contactCta: 'Business contact'
  },
  gamesPage: {
    heroEyebrow: 'Our Games',
    heroTitle: 'Two games. Two distinctive worlds.',
    heroDescription: 'Explore multiplayer experiences from Lv.B, created to be easy to join and memorable long after the session ends.',
    featuredEyebrow: 'Current featured project',
    featuredDescription: 'MushHero is a cooperative roguelite defense game where players fight together against monster waves and powerful bosses, shaping a different strategy every run.',
    releasedEyebrow: 'Released in Early Access',
    releasedDescription: 'Mush Dash is an online party racing game where up to seven players dodge deadly traps, collect Mushroom Coins and race for the final crown.',
    detailCta: 'View game details',
    gameImageAlts: {
      mushhero: 'MushHero heroes approaching monsters in an official game screenshot',
      mushdash: 'Mush Dash course and mushroom racer in an official game screenshot'
    },
    principlesEyebrow: 'How we make games',
    principlesTitle: 'Games that are better together.',
    principlesDescription: 'We build clear, welcoming play around distinctive worlds and shared moments.',
    principles: [
      { title: 'Distinctive Worlds', description: 'Each game begins with a world and personality of its own.' },
      { title: 'Multiplayer at Heart', description: 'We create moments that players can laugh through, share and grow from together.' },
      { title: 'Memorable Sessions', description: 'Our games are easy to pick up and designed to stay with players after play ends.' }
    ],
    contactEyebrow: 'Business contact',
    contactTitle: 'Talk with Lv.B.',
    contactDescription: 'For partnerships, events and exhibitions, creators and Steam Curators, press, interviews and other company inquiries.',
    contactCta: 'Business contact'
  },
  about: {
    heroEyebrow: 'About Lv.B',
    heroTitle: 'Games to laugh, connect and grow together.',
    heroDescription: 'Lv.B is an indie game studio based in Busan, South Korea. We create multiplayer games set in distinctive worlds—experiences where players can laugh, connect, and grow together. Our goal is to make games that are easy to pick up, yet memorable long after the session ends.',
    logoAlt: 'Lv.B',
    capabilitiesEyebrow: 'What we do',
    capabilitiesTitle: 'What shapes an Lv.B game.',
    capabilities: [
      { title: 'Multiplayer Games', description: 'We design experiences that become more fun and meaningful when played together.' },
      { title: 'Distinctive Worlds', description: 'Every project grows from a setting and personality players can recognize and remember.' },
      { title: 'Approachable Play', description: 'We make games that are easy to begin without losing the depth that keeps a session engaging.' }
    ],
    approachEyebrow: 'Our approach',
    approachTitle: 'Easy to join. Worth remembering.',
    approachDescription: 'We focus on clear play, shared moments and experiences that continue to resonate after the session.',
    approach: [
      { title: 'Easy to Pick Up', description: 'Clear rules and readable goals help players find the fun without unnecessary friction.' },
      { title: 'Better Together', description: 'Multiplayer moments are built to encourage laughter, connection and shared growth.' },
      { title: 'Built to Stay', description: 'Distinctive worlds and meaningful play give each session a life beyond the final round.' }
    ],
    team: {
      eyebrow: 'Our Team',
      title: 'Small team, wide-ranging roles.',
      description: 'Lv.B is a small indie game studio whose members collaborate closely around their individual expertise. We move flexibly across disciplines, working together from planning and development to art and marketing.',
      responsibilitiesLabel: 'Responsibilities',
      roles: {
        'studio-lead': 'Studio Director',
        '3d-artist': '3D Artist'
      },
      responsibilities: {
        programming: 'Programming',
        'project-management': 'Project Management',
        marketing: 'Marketing',
        '3d-art': '3D Art'
      },
      profileAlt: '{name} profile'
    },
    locationEyebrow: 'Busan, South Korea',
    locationTitle: 'Studio Location',
    locationDescription: 'Lv.B works from Busan, where we create multiplayer games and distinctive worlds.',
    mapTitle: 'Map showing the Lv.B studio location in Busan',
    mapCta: 'Open in Google Maps',
    contactEyebrow: 'Business contact',
    contactTitle: 'Start a conversation with Lv.B.',
    contactDescription: 'For partnerships, events and exhibitions, creators and Steam Curators, press, interviews and other company inquiries.',
    contactCta: 'Business contact'
  },
  contact: {
    eyebrow: 'Business contact',
    title: 'Talk with Lv.B.',
    description: 'For partnerships, events and exhibitions, creators and Steam Curators, press, interviews and other company matters, email our business inbox directly.',
    categoriesTitle: 'Business inquiry scope',
    categories: {
      business: 'Business Inquiry',
      partnership: 'Partnership',
      events: 'Events & Exhibitions',
      creators: 'Creators & Steam Curators',
      press: 'Press & Interviews',
      general: 'General Company Inquiry'
    },
    guidanceTitle: 'Creators & press',
    creatorTitle: 'Creators & Steam Curators',
    creatorDescription: 'Creators, streamers, video producers and Steam Curators may contact us about review or coverage keys. Requests are reviewed individually, and key availability is not guaranteed.',
    creatorCta: 'Email about keys',
    pressTitle: 'Press & Interviews',
    pressDescription: 'We welcome inquiries about articles, reporting and interviews concerning our games and studio.',
    pressCta: 'Email about press',
    emailEyebrow: 'Direct email',
    emailTitle: 'Write to Lv.B from your email app.',
    emailDescription: 'The button opens a new message in your default email program with a subject and outline ready to edit.',
    emailCta: 'Email Lv.B',
    emailAddressLabel: 'Business email',
    emailNotice: 'Your email app will open so you can send the inquiry directly to Lv.B. The information included in your email is used to review and respond to your message.',
    mailtoSubject: 'Lv.B Website Business Inquiry',
    mailtoBodyTemplate: 'Hello Lv.B,\n\nName:\nCompany / Organization:\nInquiry category (Business Inquiry / Partnership / Events & Exhibitions / Creators & Steam Curators / Press & Interviews / General Company Inquiry):\nMessage:\n',
    supportTitle: 'Game support',
    supportNote: 'Game feedback, bug reports and technical support are handled through our official community channels.',
    supportCta: 'Visit Discord'
  },
  news: {
    heroEyebrow: 'News & Press',
    heroTitle: 'Latest from Lv.B.',
    heroDescription: 'Verified interviews, coverage and features about our studio and games.',
    allEyebrow: 'All coverage',
    allTitle: 'News & Press',
    kindLabels: {
      interview: 'Interview',
      'press-coverage': 'Press coverage',
      'blog-review': 'Play review',
      feature: 'Feature'
    },
    sourceCta: 'Read original',
    followEyebrow: 'Official channels',
    followTitle: 'Follow Lv.B',
    followDescription: 'Get studio updates, game news and community support from our official channels.'
  },
  mushHero: {
    heroEyebrow: 'A new defense takes shape',
    heroDescription: 'A cooperative roguelite defense game about holding the line together against monster waves and powerful bosses.',
    creatorLabel: 'Developed and published by',
    genreLabel: 'Genres',
    overviewEyebrow: 'Game overview',
    overviewTitle: 'Defend together. Build a different strategy every run.',
    overviewParagraphs: [
      'Choose a role, coordinate with your team and fight through strategic action-based defense battles against incoming monsters and powerful bosses.',
      'Earn abilities and enhancements as battles progress, then shape your playstyle with randomly graded weapons, unique skills and a node-based progression system.'
    ],
    featuresEyebrow: 'How every run changes',
    featuresTitle: 'Four parts of the MushHero fight.',
    features: [
      { title: 'Defend together', description: 'Coordinate unique roles and tactics to protect the battlefield and overcome powerful bosses.' },
      { title: 'Roguelite runs', description: 'Different combinations of skills, weapons and strategies reshape each playthrough.' },
      { title: 'Weapons that shift combat', description: 'Bosses reward randomly graded weapons with unique skills that can change your combat style.' },
      { title: 'Choose a growth path', description: 'Node-based progression offers multiple routes toward a build that fits your playstyle.' }
    ],
    featuredScreenshotEyebrow: 'On the battlefield',
    featuredScreenshotTitle: 'Read the wave. Build the answer.',
    galleryEyebrow: 'Official screenshots',
    galleryTitle: 'A closer look at MushHero.',
    screenshotAlts: [
      'Four MushHero heroes approaching shadowy monsters in a village',
      'A MushHero village battlefield with windmills and mushroom heroes',
      'MushHero mushroom heroes walking beside white village buildings'
    ],
    purchaseEyebrow: 'Coming in 2027',
    purchaseTitle: 'Keep MushHero on your radar.',
    purchaseDescription: 'Add MushHero to your Steam wishlist to follow the game as it moves toward release.',
    moreGamesEyebrow: 'More from Lv.B',
    moreGamesTitle: 'Meet Mush Dash.',
    moreGameDescription: 'Race online with up to seven players, dodge deadly traps and collect Mushroom Coins on the way to the finish.',
    moreGameCta: 'View Mush Dash'
  },
  mushDash: {
    heroEyebrow: 'Run for the crown',
    heroDescription: 'An online party racing game for up to seven players. Dash, jump and dodge deadly traps before your mushroom ends up in the cooking pot.',
    creatorLabel: 'Developed and published by',
    genreLabel: 'Game tags',
    overviewEyebrow: 'Game overview',
    overviewTitle: 'Run the course. Read the traps. Collect the win.',
    overviewParagraphs: [
      'Race through three-wave matches as randomly selected stages bring new obstacle patterns each round. Read bombs and moving platforms, reach the goal and collect Mushroom Coins along the way.',
      'Final rank combines finish position with collected coins, so a smart route or risky shortcut can turn the result at the last moment.'
    ],
    featuresEyebrow: 'Three waves, one final rank',
    featuresTitle: 'A party race where every route matters.',
    features: [
      { title: 'Race with up to seven', description: 'Compete online as a group of mushroom racers sprints, jumps and explodes through each course.' },
      { title: 'Read every trap', description: 'Bomb patterns, moving platforms and other obstacles reward timing and a clear route.' },
      { title: 'Three fresh waves', description: 'Each match selects three stages from the chosen theme to keep the course changing.' },
      { title: 'Coins can change the result', description: 'Finish position and Mushroom Coins both count toward the final rank.' }
    ],
    featuredScreenshotEyebrow: 'On the course',
    featuredScreenshotTitle: 'Find the route through every obstacle.',
    galleryEyebrow: 'Official screenshots',
    galleryTitle: 'A closer look at Mush Dash.',
    screenshotAlts: [
      'Mush Dash lobby showing the Mush House course selection and a mushroom racer',
      'Mush Dash obstacle course built across a giant kitchen',
      'Mush Dash mushroom racers bouncing across glowing pads'
    ],
    purchaseEyebrow: 'Available in Early Access',
    purchaseTitle: 'Join the Mush Dash race.',
    purchaseDescription: 'Play Mush Dash through Steam or the Epic Games Store and race for the final crown.',
    moreGamesEyebrow: 'More from Lv.B',
    moreGamesTitle: 'Meet MushHero.',
    moreGameDescription: 'Defend together against monster waves and shape a different roguelite strategy every run.',
    moreGameCta: 'View MushHero'
  },
  footer: {
    tagline: 'Indie game studio in Busan, South Korea.',
    navigationLabel: 'Footer navigation',
    copyright: 'Lv.B. All rights reserved.'
  }
};
