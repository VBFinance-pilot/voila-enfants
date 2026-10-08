// All copy for the redesigned site, in Japanese, English and French.
// Every leaf is { ja, en, fr } and is resolved with `tx()` from useLang().

export const CONTACT = {
  phone: '090-6009-0792',
  phoneHref: 'tel:09060090792',
  email: 'contact-voilaJP@protonmail.com',
  line: 'https://lin.ee/PXNYpdO',
  instagram: 'https://www.instagram.com/voilaenglish/',
  instagramHandle: '@voilaenglish',
  mapsUrl: 'https://maps.app.goo.gl/?q=Voil%C3%A0+les+enfants+Kyoto',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Voil%C3%A0+les+enfants%2C+10-122+Oeda+Kutsukake-cho%2C+Nishikyo-ku%2C+Kyoto',
};

// « Voilà chef » (ex-L’Apéro) lives on its own site; every link to it is outbound.
export const VOILA_CHEF_URL = 'https://voila-chef.vercel.app';

export const common = {
  tagline: { ja: 'ACTIVITY LANGUAGE SCHOOL · KYOTO', en: 'ACTIVITY LANGUAGE SCHOOL · KYOTO', fr: 'ACTIVITY LANGUAGE SCHOOL · KYOTO' },
  addressShort: { ja: '京都市西京区大枝沓掛町', en: 'Oeda Kutsukake-cho, Nishikyo-ku, Kyoto', fr: 'Oeda Kutsukake-cho, Nishikyo-ku, Kyoto' },
  address: {
    ja: '〒610-1106 京都府京都市西京区大枝沓掛町10-122',
    en: '10-122 Oeda Kutsukake-cho, Nishikyo-ku, Kyoto 610-1106',
    fr: '10-122 Oeda Kutsukake-cho, Nishikyo-ku, Kyoto 610-1106',
  },
  learnMore: { ja: '詳しく見る', en: 'Learn more', fr: 'En savoir plus' },
  bookTrial: { ja: '無料体験を予約', en: 'Book a free trial', fr: 'Cours d’essai gratuit' },
  bookTrial60: { ja: '60分の無料体験を予約', en: 'Book a free 60-min trial', fr: 'Réserver 60 min d’essai gratuit' },
  chatLine: { ja: 'LINEで相談する', en: 'Chat on LINE', fr: 'Écrire sur LINE' },
  menu: { ja: 'メニュー', en: 'Menu', fr: 'Menu' },
  close: { ja: '閉じる', en: 'Close', fr: 'Fermer' },
};

export const nav = {
  util: [
    { href: '/#contact', label: { ja: 'アクセス', en: 'Access', fr: 'Accès' } },
    { href: '/franchise', label: { ja: 'フランチャイズ', en: 'Franchise', fr: 'Franchise' } },
    { href: '/careers', label: { ja: '採用情報', en: 'Careers', fr: 'Recrutement' } },
  ],
  main: [
    { href: '/learn', label: { ja: '学ぶ', en: 'Learn', fr: 'Apprendre' }, sub: { ja: 'レッスン', en: 'Lessons', fr: 'Cours' } },
    { href: '/homestay', label: { ja: 'ホームステイ', en: 'Homestay', fr: 'Homestay' }, sub: { ja: 'ホームステイ・キャンプ', en: 'Homestay & camps', fr: 'Homestay & camps' } },
    { href: '/celebrate', label: { ja: '集う', en: 'Celebrate', fr: 'Célébrer' }, sub: { ja: 'イベント・Voilà chef', en: 'Events & Voilà chef', fr: 'Événements & Voilà chef' } },
    { href: '/#hosts', label: { ja: '私たちについて', en: 'About us', fr: 'À propos' } },
  ],
};

export const home = {
  hero: {
    eyebrow: { ja: 'BIENVENUE　·　WELCOME　·　ようこそ', en: 'BIENVENUE　·　WELCOME　·　ようこそ', fr: 'BIENVENUE　·　WELCOME　·　ようこそ' },
    title1: { ja: '英語は翼、', en: 'English gives you wings —', fr: 'L’anglais vous donne des ailes —' },
    title2: { ja: '飛ぶのはあなた。', en: 'you do the flying.', fr: 'à vous de voler.' },
    h1seo: {
      ja: '京都・西京区の英語・フランス語・日本語 アクティビティ・ランゲージスクール',
      en: 'English, French & Japanese activity language school in Nishikyo, Kyoto',
      fr: 'École de langues par l’activité — anglais, français, japonais — à Nishikyo, Kyoto',
    },
    sub: {
      ja: '三か国語が飛び交う、ホームステイのような小さな海外。プチ留学のように、英語だけではなく世界を体感する。英語という彩りを、あなたへ。',
      en: 'A little corner of abroad where three languages fill the air — like a homestay. Like a short study trip, you experience not just English, but the world. English: a new colour, for you.',
      fr: 'Un petit bout d’étranger où trois langues se croisent, comme en homestay. Comme un mini-séjour linguistique, on y vit bien plus que l’anglais : le monde. L’anglais, une couleur de plus dans votre vie.',
    },
    ctaAll: { ja: 'すべてのプログラム', en: 'All programmes', fr: 'Tous les programmes' },
    scroll: { ja: 'SCROLL', en: 'SCROLL', fr: 'DÉFILER' },
  },
  philosophy: {
    label: { ja: 'OUR PHILOSOPHY', en: 'OUR PHILOSOPHY', fr: 'NOTRE PHILOSOPHIE' },
    motto: { ja: 'All different, all good.', en: 'All different, all good.', fr: 'All different, all good.' },
    sub: {
      ja: 'ひとりひとり違う。だからこそ、誰もが素晴らしい。',
      en: 'Every person is different — and that is what makes each of us remarkable.',
      fr: 'Chaque personne est différente — et c’est précisément ce qui la rend remarquable.',
    },
    body: {
      ja: 'ことばは、勉強するものではなく、生きるもの。子どもたちは母語を覚えたときのように、遊び、動き、つくりながら。中高生や大人は、食卓で、旅先で、分かち合うひとときの中で。年齢に関わらず、3つのことばの世界への扉をひらき、そこを「自分の居場所」と感じられる自信を育てます。',
      en: 'A language is not studied — it is lived. Children learn it the way they learned their mother tongue: by playing, moving and creating. Teenagers and adults find it at the table, on the road, in the moments we share. Whatever your age, we open the door to a world in three languages — and the confidence to feel at home in it.',
      fr: 'Une langue ne s’étudie pas : elle se vit. Les enfants l’apprennent comme leur langue maternelle — en jouant, en bougeant, en créant. Adolescents et adultes la trouvent à table, en voyage, dans les moments partagés. Quel que soit votre âge, nous ouvrons la porte d’un monde en trois langues — et la confiance de s’y sentir chez soi.',
    },
    values: [
      { ja: 'コミュニケーション', en: 'Communication', fr: 'Communication' },
      { ja: '創造力', en: 'Creativity', fr: 'Créativité' },
      { ja: '自分を好きになる力', en: 'Self-confidence', fr: 'Confiance en soi' },
    ],
  },
  facts: [
    { value: '15+', label: { ja: '年の英語教育経験', en: 'years teaching English', fr: 'ans d’enseignement de l’anglais' }, sub: { ja: '日本・ベトナム・フランス', en: 'Japan · Vietnam · France', fr: 'Japon · Vietnam · France' } },
    { value: '3', label: { ja: '言語が毎日飛び交う環境', en: 'languages spoken every day', fr: 'langues parlées chaque jour' }, sub: { ja: '英語・フランス語・日本語', en: 'English · French · Japanese', fr: 'Anglais · français · japonais' } },
    { value: '¥0', label: { ja: '教材費・無料体験', en: 'Free trial · no materials fee', fr: 'Essai gratuit · aucun frais de matériel' }, sub: { ja: 'テキストの購入は不要', en: 'No textbooks to buy', fr: 'Aucun manuel à acheter' } },
    { value: '∞', label: { ja: '振替レッスン無制限', en: 'Unlimited make-up lessons', fr: 'Rattrapages illimités' }, sub: { ja: '京都エリアでは珍しい仕組み', en: 'Rare in the Kyoto area', fr: 'Rare dans la région de Kyoto' } },
  ],
  universes: {
    label: { ja: 'THREE WAYS TO JOIN US　·　3つの世界', en: 'THREE WAYS TO JOIN US', fr: 'TROIS FAÇONS DE NOUS REJOINDRE' },
    title1: { ja: '学ぶ、滞在する、集う。', en: 'Learn, stay,', fr: 'Apprendre, séjourner,' },
    title2: { ja: 'すべて、3つのことばで。', en: 'celebrate.', fr: 'célébrer.' },
    discover: { ja: '詳しく見る', en: 'Discover', fr: 'Découvrir' },
    items: [
      { key: 'learn', href: '/learn', slot: 'home_learn', name: { ja: 'Voilà Experience', en: 'Voilà Experience', fr: 'Voilà Experience' },
        line: { ja: '赤ちゃんから大人まで。スタジオとオンラインで、体験しながら学ぶレッスン。', en: 'From babies to adults. Learn-by-doing lessons, in our Kyoto studio and online.', fr: 'Des bébés aux adultes. Des cours par l’expérience, au studio de Kyoto et en ligne.' },
        list: [{ ja: 'キッズ', en: 'Kids', fr: 'Enfants' }, { ja: '中高生・大学生', en: 'Secondary & university', fr: 'Collège – université' }, { ja: 'オンライン・受験', en: 'Online & exams', fr: 'En ligne & examens' }, { ja: '大人', en: 'Adults', fr: 'Adultes' }] },
      { key: 'live', href: '/homestay', slot: 'home_live', name: { ja: 'Voilà Homestay', en: 'Voilà Homestay', fr: 'Voilà Homestay' },
        line: { ja: 'まるで海外の家庭にホームステイするような空間。英語を学ぶ場所ではなく、英語に浸り英語で暮らしてみる場所。', en: 'Like staying with a family abroad. Not a place to study English — a place to live in it.', fr: 'Comme séjourner dans une famille à l’étranger. Pas un lieu où l’on étudie l’anglais : un lieu où l’on vit en anglais.' },
        list: [{ ja: 'ホームステイ in 京都', en: 'Homestay in Kyoto', fr: 'Homestay à Kyoto' }, { ja: '旅するホームステイ', en: 'Travelling homestay', fr: 'Homestay en voyage' }, { ja: 'English Camp', en: 'English Camp', fr: 'English Camp' }] },
      { key: 'celebrate', href: '/celebrate', slot: 'home_celebrate', name: { ja: 'Voilà Moments', en: 'Voilà Moments', fr: 'Voilà Moments' },
        line: { ja: '誕生日会からフランス式アペリティフまで、オーダーメイドの至福のひとときを。', en: 'From birthday parties to French apéritifs — bespoke moments.', fr: 'De l’anniversaire à l’apéritif à la française — des moments sur mesure.' },
        list: [{ ja: 'バースデー＆イベント', en: 'Birthdays & events', fr: 'Anniversaires & événements' }, { ja: 'Voilà chef（出張シェフ）', en: 'Voilà chef', fr: 'Voilà chef' }] },
    ],
  },
  moments: {
    label: { ja: 'MOMENTS　·　ヴォアラの日常', en: 'MOMENTS', fr: 'MOMENTS' },
    title: { ja: 'ヴォアラの毎日', en: 'Life at Voilà', fr: 'La vie chez Voilà' },
    tabs: { photos: { ja: '写真', en: 'Photos', fr: 'Photos' }, films: { ja: '動画', en: 'Films', fr: 'Films' }, instagram: { ja: 'Instagram', en: 'Instagram', fr: 'Instagram' } },
  },
  learn: {
    label: { ja: 'LEARN　·　学ぶ', en: 'LEARN　·　学ぶ', fr: 'APPRENDRE　·　学ぶ' },
    title1: { ja: '教科書ではなく、', en: 'Not from textbooks —', fr: 'Pas dans les manuels —' },
    title2: { ja: '毎日の暮らしから。', en: 'from everyday life.', fr: 'dans la vie de tous les jours.' },
    intro: {
      ja: '学校で学ぶことを補う、実用のことば。国際的な家族である私たちの日常に、生徒さんを迎え入れます。英語・フランス語、海外の方には日本語も。',
      en: 'Practical language that complements what is learned at school. We welcome students into the everyday life of our international family. English and French — and Japanese for international learners.',
      fr: 'Une langue pratique, en complément de l’école. Nous accueillons nos élèves dans le quotidien de notre famille internationale. Anglais et français — et japonais pour les apprenants étrangers.',
    },
    cards: [
      {
        slot: 'learn_kids', img: '/img/slime.jpg',
        alt: { ja: 'スライム作りを楽しむ子どもたち', en: 'Children enjoying making slime', fr: 'Des enfants s’amusent à fabriquer du slime' },
        label: { ja: 'STUDIO KYOTO · 赤ちゃん〜12歳', en: 'STUDIO KYOTO · BABIES TO 12', fr: 'STUDIO KYOTO · BÉBÉS À 12 ANS' },
        title: { ja: 'キッズ・アクティビティ', en: 'Kids Activities', fr: 'Activités enfants' },
        desc: {
          ja: '料理、絵、カード、ゲーム。「好き・嫌い・したい」を毎日使えることばに。グループでも個別でも。',
          en: 'Cooking, painting, picture cards, games. Turning “I like, I don’t like, I want” into words they use every day. Group or private.',
          fr: 'Cuisine, peinture, cartes illustrées, jeux. « J’aime, je n’aime pas, je veux » deviennent des mots du quotidien. En groupe ou en individuel.',
        },
        price: { ja: '1時間 ¥2,800〜', en: 'From ¥2,800 / hour', fr: 'Dès ¥2 800 / heure' },
      },
      {
        slot: 'learn_secondary', img: '/img/tatami2.jpg',
        alt: { ja: '和室で学ぶ中高生', en: 'Teenagers studying in a tatami room', fr: 'Des adolescents étudient dans une pièce en tatami' },
        label: { ja: 'STUDIO KYOTO · 中学生〜大学生', en: 'STUDIO KYOTO · JUNIOR HIGH TO UNIVERSITY', fr: 'STUDIO KYOTO · COLLÈGE À UNIVERSITÉ' },
        title: { ja: '中高生・大学生の英語', en: 'Secondary & University English', fr: 'Anglais collège, lycée & université' },
        desc: {
          ja: '学校の目標に合わせて。テーマや課題を幅広く扱い、着実にレベルアップします。',
          en: 'Built around school goals. A wide range of topics and themes for steady, measurable progress.',
          fr: 'Construit autour des objectifs scolaires. Un large éventail de sujets pour progresser pas à pas.',
        },
        price: { ja: '1時間 ¥3,800〜', en: 'From ¥3,800 / hour', fr: 'Dès ¥3 800 / heure' },
      },
      {
        slot: 'learn_online', img: '/img/classroom.jpg',
        alt: { ja: '教室で学ぶ生徒たち', en: 'Students learning in class', fr: 'Des élèves en classe' },
        label: { ja: 'ONLINE · 学習サポート', en: 'ONLINE · ACADEMIC SUPPORT', fr: 'EN LIGNE · SOUTIEN SCOLAIRE' },
        title: { ja: 'オンライン・受験対策', en: 'Online & Exam Prep', fr: 'En ligne & préparation aux examens' },
        desc: {
          ja: 'TOEIC・TOEFL・学校の試験対策、算数・数学、フランス語。インター校の宿題やプレゼンも。',
          en: 'TOEIC, TOEFL and school exams, maths, French. Homework and presentations for international-school students.',
          fr: 'TOEIC, TOEFL, examens scolaires, maths, français. Devoirs et exposés pour les élèves d’écoles internationales.',
        },
        price: { ja: '30分 ¥2,000〜', en: 'From ¥2,000 / 30 min', fr: 'Dès ¥2 000 / 30 min' },
      },
      {
        slot: 'learn_adults', img: '/img/bordeaux.jpg',
        alt: { ja: '旅先の街並み', en: 'A street abroad', fr: 'Une rue à l’étranger' },
        label: { ja: 'ADULTS · 大人', en: 'ADULTS', fr: 'ADULTES' },
        title: { ja: '大人のための語学', en: 'Languages for Adults', fr: 'Langues pour adultes' },
        desc: {
          ja: '仕事、趣味、旅行の前に。目的に合わせてカスタマイズする、同じ「体験で学ぶ」レッスン。',
          en: 'For work, for pleasure, before a trip. The same learn-by-doing approach, tailored to your goals.',
          fr: 'Pour le travail, le plaisir, avant un voyage. La même approche par l’expérience, adaptée à vos objectifs.',
        },
        price: { ja: '1時間 ¥4,000〜', en: 'From ¥4,000 / hour', fr: 'Dès ¥4 000 / heure' },
      },
    ],
    alsoLabel: { ja: 'ほかにも（1時間 ¥4,000〜）：', en: 'Also available (from ¥4,000 / hour):', fr: 'Aussi (dès ¥4 000 / heure) :' },
    also: [
      { ja: '英語学童', en: 'English After-school', fr: 'Garderie en anglais' },
      { ja: 'VIP自宅レッスン', en: 'VIP Home Lessons', fr: 'Cours VIP à domicile' },
      { ja: '先生向けコーチング', en: 'Teacher Coaching', fr: 'Coaching enseignants' },
    ],
  },
  live: {
    label: { ja: 'LIVE　·　暮らす', en: 'LIVE　·　暮らす', fr: 'VIVRE　·　暮らす' },
    title1: { ja: '家族の一員として、', en: 'Live the language', fr: 'Vivre la langue' },
    title2: { ja: 'ことばと暮らす。', en: 'as one of the family.', fr: 'comme un membre de la famille.' },
    intro: {
      ja: '京都の私たちの家で。旅先で。そしてキャンプで。朝から夜まで、食卓も会話も遊びも、すべてがレッスンになります。',
      en: 'In our home in Kyoto. On the road. At camp. From morning to night, every meal, conversation and game becomes a lesson.',
      fr: 'Chez nous à Kyoto. En voyage. En camp. Du matin au soir, chaque repas, chaque conversation, chaque jeu devient une leçon.',
    },
    cards: [
      {
        slot: 'live_homestay', href: '/homestay#kyoto', img: '/img/tatami2.jpg',
        alt: { ja: '和室でくつろぐ生徒たち', en: 'Students relaxing in a tatami room', fr: 'Des élèves détendus dans une pièce en tatami' },
        label: { ja: 'KYOTO · 私たちの家で', en: 'KYOTO · IN OUR HOME', fr: 'KYOTO · CHEZ NOUS' },
        title: { ja: 'ホームステイ in 京都', en: 'Homestay in Kyoto', fr: 'Homestay à Kyoto' },
        desc: {
          ja: '木と畳の和室に滞在。手づくりの食事、パーソナルレッスン、家族との会話、文化体験つき。',
          en: 'Stay in a wood-and-tatami room. Home-cooked meals, private lessons, family conversations and cultural outings.',
          fr: 'Une chambre en bois et tatami. Repas faits maison, cours particuliers, conversations en famille et sorties culturelles.',
        },
      },
      {
        slot: 'live_travel', href: '/homestay#travel', img: '/img/balipool.jpg',
        alt: { ja: 'バリのヴィラのプール', en: 'Pool at a villa in Bali', fr: 'Piscine d’une villa à Bali' },
        label: { ja: 'FRANCE · BALI · VIETNAM · OKINAWA · TOKYO', en: 'FRANCE · BALI · VIETNAM · OKINAWA · TOKYO', fr: 'FRANCE · BALI · VIETNAM · OKINAWA · TOKYO' },
        title: { ja: '旅するホームステイ', en: 'Travelling Homestay', fr: 'Homestay en voyage' },
        desc: {
          ja: '私たち家族と一緒に旅をしながら、英語・フランス語で過ごす特別な滞在。',
          en: 'A special stay travelling with our family, lived in English and French.',
          fr: 'Un séjour unique en voyage avec notre famille, vécu en anglais et en français.',
        },
      },
      {
        slot: 'live_camp', href: '/homestay?topic=live_camp#apply', img: '/img/bbq.jpg',
        alt: { ja: 'キャンプのバーベキュー', en: 'Camp barbecue', fr: 'Barbecue au camp' },
        label: { ja: 'SUMMER CAMP · WINTER CAMP', en: 'SUMMER CAMP · WINTER CAMP', fr: 'CAMP D’ÉTÉ · CAMP D’HIVER' },
        title: { ja: 'English Camp', en: 'English Camp', fr: 'English Camp' },
        desc: {
          ja: '料理、絵、BBQ、手づくり、文化体験。仲間と一緒に、すべて英語で。',
          en: 'Cooking, painting, BBQ, crafts and cultural outings — with friends, all in English.',
          fr: 'Cuisine, peinture, BBQ, bricolage et sorties culturelles — entre amis, tout en anglais.',
        },
      },
    ],
  },
  celebrate: {
    label: { ja: 'CELEBRATE　·　集う', en: 'CELEBRATE　·　集う', fr: 'CÉLÉBRER　·　集う' },
    title1: { ja: '特別な日を、', en: 'Special days,', fr: 'Les grands jours,' },
    title2: { ja: '3つのことばで。', en: 'in three languages.', fr: 'en trois langues.' },
    intro: {
      ja: '誕生日会からフランス式アペリティフまで。英語・フランス語・日本語で、オーダーメイドのひとときを演出します。',
      en: 'From birthday parties to French apéritifs — bespoke moments in English, French and Japanese.',
      fr: 'De l’anniversaire à l’apéritif à la française — des moments sur mesure en anglais, français et japonais.',
    },
    events: {
      slot: 'celebrate_events', img: '/img/crowns.jpg',
      alt: { ja: '王冠をかぶってお祝いする子どもたち', en: 'Children celebrating in paper crowns', fr: 'Des enfants font la fête avec des couronnes' },
      label: { ja: 'EVENTS · オーダーメイド', en: 'EVENTS · BESPOKE', fr: 'ÉVÉNEMENTS · SUR MESURE' },
      title: { ja: 'バースデー＆イベント', en: 'Birthdays & Events', fr: 'Anniversaires & événements' },
      desc: {
        ja: '誕生日会、おやつパーティー、季節のイベント。ご希望に合わせて、英語・フランス語・日本語で企画します。生徒さん以外の方もどうぞ。',
        en: 'Birthday parties, afternoon tea parties, seasonal events — planned to your wishes in English, French and Japanese. Open to everyone, not only our students.',
        fr: 'Anniversaires, goûters, fêtes de saison — organisés selon vos envies en anglais, français et japonais. Ouvert à tous, pas seulement à nos élèves.',
      },
    },
    // Voilà chef (ex-L’Apéro): a separate site, see VOILA_CHEF_URL. Image slot
    // `celebrate_chef` (the old `celebrate_apero` slot still exists in Supabase, unused).
    chef: {
      slot: 'celebrate_chef', img: '/img/voila-chef.jpg',
      alt: { ja: '京都の町家に整えられた食卓', en: 'A table set in a Kyoto townhouse', fr: 'Table dressée dans une maison de Kyoto' },
      label: { ja: 'VOILÀ CHEF · 出張シェフ', en: 'VOILÀ CHEF · TWO CHEFS', fr: 'VOILÀ CHEF · DEUX CHEFS' },
      desc: {
        ja: 'フランス料理のKazuと日本料理のYuichiro、二人のシェフ。プライベートディナー、アペリティフ、ご自宅への出張シェフ。',
        en: 'Two chefs — Kazu (French) and Yuichiro (Japanese). Private dinners, apéritifs and chef at home.',
        fr: 'Deux chefs — Kazu (française) et Yuichiro (japonaise). Dîners privés, apéritifs et chef à domicile.',
      },
      cta: { ja: 'Voilà chef を見る', en: 'Discover Voilà chef', fr: 'Découvrir Voilà chef' },
    },
    quote: { ja: 'オーダーメイド・お見積り', en: 'Bespoke · request a quote', fr: 'Sur mesure · demander un devis' },
  },
  franchise: {
    label: { ja: 'FRANCHISE　·　フランチャイズ', en: 'FRANCHISE', fr: 'FRANCHISE' },
    title1: { ja: 'あなたのことばで、', en: 'In your language,', fr: 'Dans votre langue,' },
    title2: { ja: 'あなたの街に、Voilà を。', en: 'in your city — Voilà.', fr: 'dans votre ville — Voilà.' },
    body: {
      ja: 'イタリア語、トルコ語、韓国語……。教師の経験は不要です。あなたのルーツと世界観を活かし、英語やあなたのことばでのアクティビティを通して、お客さまをあなたの世界へ。私たちのメソッドとブランドで、アクティビティスクールを開きませんか。',
      en: 'Italian, Turkish, Korean… No teaching background needed. Share your roots and your world through activities in English or your own language, and immerse your clients in it. Open your own activity school with our method and brand.',
      fr: 'Italien, turc, coréen… Pas besoin d’être professeur. Partagez vos racines et votre univers à travers des activités en anglais ou dans votre langue, et faites-y plonger vos clients. Ouvrez votre activity school avec notre méthode et notre marque.',
    },
    cta1: { ja: 'フランチャイズの流れを見る', en: 'See the franchise journey', fr: 'Découvrir le parcours franchise' },
    cta2: { ja: 'お問い合わせ・資料請求', en: 'Contact us · request the brochure', fr: 'Nous contacter · demander la brochure' },
  },
  admissions: {
    label: { ja: 'ADMISSIONS　·　入会案内', en: 'ADMISSIONS', fr: 'INSCRIPTIONS' },
    title: { ja: '入会までの流れ', en: 'How to join', fr: 'Comment s’inscrire' },
    steps: [
      { t: { ja: 'お問い合わせ', en: 'Get in touch', fr: 'Prise de contact' }, d: { ja: 'LINE・お電話・フォームから、お気軽にどうぞ。', en: 'By LINE, phone or form — whichever suits you.', fr: 'Par LINE, téléphone ou formulaire — comme vous préférez.' } },
      { t: { ja: '60分の無料体験レッスン', en: 'Free 60-minute trial lesson', fr: 'Cours d’essai gratuit de 60 min' }, d: { ja: 'ご兄弟・お友達もご一緒に。講師が丁寧にレベルチェックを行います。', en: 'Siblings and friends welcome. Our teacher carefully assesses your child’s level.', fr: 'Frères, sœurs et amis bienvenus. Le professeur évalue le niveau avec soin.' } },
      { t: { ja: 'クラスとプランのご提案', en: 'Class & plan proposal', fr: 'Proposition de cours & formule' }, d: { ja: 'お子さまに最適なクラス、レッスンプラン、月謝をご説明します。', en: 'We recommend the best class, lesson plan and monthly fee.', fr: 'Nous proposons la classe, la formule et le tarif mensuel les mieux adaptés.' } },
      { t: { ja: 'レッスンスタート', en: 'Lessons begin', fr: 'Début des cours' }, d: { ja: 'テキストや教材の購入は不要。欠席しても振替は無制限です。', en: 'No textbooks or materials to buy. Unlimited make-up lessons if you miss a class.', fr: 'Aucun manuel ni matériel à acheter. Rattrapages illimités en cas d’absence.' } },
    ],
    tuitionLabel: { ja: 'TUITION　·　料金', en: 'TUITION', fr: 'TARIFS' },
    tuition: [
      { l: { ja: 'ベビー・2歳クラス', en: 'Baby & age-2 class', fr: 'Classe bébés & 2 ans' }, v: { ja: '1時間 ¥2,800〜', en: 'From ¥2,800 / hour', fr: 'Dès ¥2 800 / heure' } },
      { l: { ja: 'キッズ（3〜12歳）', en: 'Kids (ages 3–12)', fr: 'Enfants (3–12 ans)' }, v: { ja: '1時間 ¥3,200〜', en: 'From ¥3,200 / hour', fr: 'Dès ¥3 200 / heure' } },
      { l: { ja: '中学生・高校生・大学生', en: 'Junior high · High school · University', fr: 'Collège · lycée · université' }, v: { ja: '1時間 ¥3,800〜', en: 'From ¥3,800 / hour', fr: 'Dès ¥3 800 / heure' } },
      { l: { ja: '大人', en: 'Adults', fr: 'Adultes' }, v: { ja: '1時間 ¥4,000〜', en: 'From ¥4,000 / hour', fr: 'Dès ¥4 000 / heure' } },
      { l: { ja: 'オンライン', en: 'Online', fr: 'En ligne' }, v: { ja: '30分 ¥2,000〜', en: 'From ¥2,000 / 30 min', fr: 'Dès ¥2 000 / 30 min' } },
      { l: { ja: '学童・VIP・コーチング', en: 'After-school · VIP · Coaching', fr: 'Garderie · VIP · coaching' }, v: { ja: '1時間 ¥4,000〜', en: 'From ¥4,000 / hour', fr: 'Dès ¥4 000 / heure' } },
      { l: { ja: 'ホームステイ', en: 'Homestay', fr: 'Homestay' }, v: { ja: '1泊 ¥15,000〜', en: 'From ¥15,000 / night', fr: 'Dès ¥15 000 / nuit' } },
      { l: { ja: 'イベント・Voilà chef', en: 'Events · Voilà chef', fr: 'Événements · Voilà chef' }, v: { ja: 'オーダーメイド', en: 'Bespoke', fr: 'Sur mesure' } },
      { l: { ja: '無料体験・教材費', en: 'Free trial · materials', fr: 'Essai gratuit · matériel' }, v: { ja: '無料', en: 'Free', fr: 'Gratuit' }, accent: true },
      { l: { ja: '振替レッスン', en: 'Make-up lessons', fr: 'Rattrapages' }, v: { ja: '無制限', en: 'Unlimited', fr: 'Illimités' }, accent: true },
    ],
    cta: { ja: '無料体験を予約する', en: 'Book your free trial', fr: 'Réserver l’essai gratuit' },
  },
  hosts: {
    label: { ja: 'YOUR HOSTS', en: 'YOUR HOSTS', fr: 'VOS HÔTES' },
    lead: { ja: '4人の子どもを育てる、日仏ミックスの家族です。', en: 'A French-Japanese family raising four children.', fr: 'Une famille franco-japonaise qui élève quatre enfants.' },
    body: {
      ja: "Voilàは、15年以上にわたる世界各地での経験をもとに、\n京都にいながら異文化に触れられる「もうひとつの居場所」をつくっています。\n\n英語を学ぶだけではなく、\n遊び、笑い、挑戦しながら、\nさまざまな文化や価値観を体感する。\n\n言葉は、世界へつながる虹。\nそして、未来を切り拓くための武器。\n\n子どもたちには、\n世界へ羽ばたく翼を。\n\n大人の方々には、\n日常を彩る言葉を。\n\nVoilàは、言語という力を味方に、\n一人ひとりの世界を広げていきます。\n\n英語という彩りを、あなたへ。\n英語は翼、飛ぶのはあなた…",
      en: "Drawing on more than 15 years of experience around the world, Voilà creates “another home” in Kyoto — a place to meet other cultures without leaving the city.\n\nMore than learning English:\nplaying, laughing, taking on challenges,\nand experiencing many cultures and ways of seeing the world.\n\nLanguage is a rainbow that connects us to the world —\nand a strength to carve out the future.\n\nFor children,\nwings to fly out into the world.\n\nFor adults,\nwords that bring colour to everyday life.\n\nWith the power of language on our side,\nVoilà opens up each person’s world.\n\nEnglish: a new colour, for you.\nEnglish gives you wings — you do the flying.",
      fr: "Forte de plus de 15 ans d’expérience aux quatre coins du monde, Voilà crée à Kyoto « un autre chez-soi », où l’on rencontre d’autres cultures sans quitter la ville.\n\nBien plus qu’apprendre l’anglais :\njouer, rire, relever des défis,\net vivre la diversité des cultures et des regards.\n\nLa langue est un arc-en-ciel qui nous relie au monde —\net une force pour tracer son avenir.\n\nAux enfants,\ndes ailes pour s’envoler vers le monde.\n\nAux adultes,\ndes mots qui colorent le quotidien.\n\nAvec la force des langues à nos côtés,\nVoilà ouvre le monde de chacun.\n\nL’anglais, une couleur de plus dans votre vie.\nL’anglais vous donne des ailes — à vous de voler.",
    },
  },
  upcoming: {
    label: { ja: 'UPCOMING　·　今後の予定', en: 'UPCOMING', fr: 'À VENIR' },
    title: { ja: '次のイベント', en: 'What’s next', fr: 'Prochains rendez-vous' },
    signup: { ja: '申込', en: 'Sign up', fr: 'S’inscrire' },
    empty: { ja: '次回のイベントは近日公開。LINEでお知らせします。', en: 'Next events coming soon — we announce them on LINE.', fr: 'Prochains événements bientôt annoncés — suivez-nous sur LINE.' },
  },
  instagram: {
    label: { ja: 'FOLLOW OUR DAYS', en: 'FOLLOW OUR DAYS', fr: 'SUIVEZ NOS JOURNÉES' },
    title: { ja: 'ヴォアラの日常', en: 'Life at Voilà', fr: 'La vie chez Voilà' },
    sub: {
      ja: '教室、キャンプ、旅、食卓。毎日の小さな瞬間を @voilaenglish でシェアしています。',
      en: 'Classes, camps, travels and family tables — the small moments of every day, shared on @voilaenglish.',
      fr: 'Cours, camps, voyages, repas en famille — les petits moments du quotidien, partagés sur @voilaenglish.',
    },
    follow: { ja: 'Instagramでフォロー', en: 'Follow on Instagram', fr: 'Suivre sur Instagram' },
  },
  gallery: {
    label: { ja: 'MOMENTS　·　ギャラリー', en: 'MOMENTS', fr: 'MOMENTS' },
    title: { ja: 'ヴォアラの思い出', en: 'Moments at Voilà', fr: 'Moments chez Voilà' },
    more: { ja: 'もっと見る', en: 'See more', fr: 'Voir plus' },
    less: { ja: '閉じる', en: 'Show less', fr: 'Voir moins' },
  },
  videos: {
    label: { ja: 'FILMS　·　動画', en: 'FILMS', fr: 'FILMS' },
    title: { ja: '体験の様子を動画で', en: 'Our experiences on film', fr: 'Nos expériences en vidéo' },
  },
  visit: {
    label: { ja: 'VISIT US　·　見学・無料体験', en: 'VISIT US　·　FREE TRIAL', fr: 'NOUS RENDRE VISITE　·　ESSAI GRATUIT' },
    title1: { ja: 'まずは一度、', en: 'Come and see us —', fr: 'Venez nous voir —' },
    title2: { ja: '遊びにいらしてください。', en: 'we’d love to meet you.', fr: 'on a hâte de vous rencontrer.' },
    map: { ja: '地図を見る', en: 'View map', fr: 'Voir le plan' },
  },
  contact: {
    label: { ja: 'CONTACT & ACCESS　·　お問い合わせ・アクセス', en: 'CONTACT & ACCESS', fr: 'CONTACT & ACCÈS' },
    title: { ja: 'Can’t wait to meet you!', en: 'Can’t wait to meet you!', fr: 'Au plaisir de vous rencontrer !' },
    sub: { ja: 'ご質問、ご予約、プログラムのご案内など、どうぞお気軽にご連絡ください。', en: 'Questions, bookings or programme details — feel free to get in touch.', fr: 'Questions, réservations ou informations sur nos programmes — écrivez-nous.' },
    addressL: { ja: '住所', en: 'Address', fr: 'Adresse' },
    phoneL: { ja: '電話', en: 'Phone', fr: 'Téléphone' },
    emailL: { ja: 'メール', en: 'Email', fr: 'E-mail' },
    lineSub: { ja: 'LINEで簡単にお問い合わせ', en: 'The easiest way to reach us', fr: 'Le plus simple pour nous joindre' },
    lineBtn: { ja: 'LINEで友だち追加', en: 'Add us on LINE', fr: 'Nous ajouter sur LINE' },
    qrAlt: { ja: 'LINE QRコード', en: 'LINE QR code', fr: 'QR code LINE' },
    mapTitle: { ja: 'アクセス（京都市西京区・大枝）', en: 'Access (Oeda, Nishikyo-ku, Kyoto)', fr: 'Accès (Oeda, Nishikyo-ku, Kyoto)' },
    mapOpen: { ja: 'Google マップで開く', en: 'Open in Google Maps', fr: 'Ouvrir dans Google Maps' },
    route: { ja: '経路を検索', en: 'Get directions', fr: 'Itinéraire' },
  },
  reviews: {
    title: { ja: '保護者の声', en: 'What parents say', fr: 'Ce que disent les parents' },
    onGoogle: { ja: 'Googleで', en: 'on Google', fr: 'sur Google' },
    count: { ja: '件の評価', en: 'reviews', fr: 'avis' },
    all: { ja: 'Googleで全ての評価を見る', en: 'See all reviews on Google', fr: 'Voir tous les avis sur Google' },
  },
};

export const form = {
  title: { ja: 'メッセージを送る', en: 'Send us a message', fr: 'Envoyer un message' },
  name: { ja: 'お名前', en: 'Name', fr: 'Nom' },
  email: { ja: 'メールアドレス', en: 'Email', fr: 'E-mail' },
  message: { ja: 'メッセージ', en: 'Message', fr: 'Message' },
  messagePh: { ja: 'お問い合わせ内容、体験レッスンのご希望などをお書きください', en: 'Your question, or when you would like a trial lesson', fr: 'Votre question, ou vos disponibilités pour un cours d’essai' },
  send: { ja: '送信する', en: 'Send', fr: 'Envoyer' },
  sending: { ja: '送信中…', en: 'Sending…', fr: 'Envoi…' },
  sent: { ja: '送信しました。ありがとうございます！', en: 'Sent — thank you!', fr: 'Message envoyé — merci !' },
  failed: { ja: '送信に失敗しました。LINEかお電話でご連絡ください。', en: 'Sending failed. Please contact us on LINE or by phone.', fr: 'L’envoi a échoué. Contactez-nous par LINE ou téléphone.' },
  topic: { ja: 'お問い合わせ内容', en: 'Subject', fr: 'Sujet' },
  topicPick: { ja: '選択してください', en: 'Choose a subject', fr: 'Choisissez un sujet' },
  topicRemove: { ja: '件名を外す', en: 'Remove topic', fr: 'Retirer le sujet' },
};

export const footer = {
  learn: { ja: '学ぶ', en: 'Learn', fr: 'Apprendre' },
  live: { ja: 'ホームステイ・集う', en: 'Homestay · Celebrate', fr: 'Homestay · Célébrer' },
  school: { ja: 'スクール', en: 'The school', fr: 'L’école' },
  contact: { ja: 'お問い合わせ', en: 'Contact', fr: 'Contact' },
  follow: { ja: 'フォロー', en: 'Follow', fr: 'Suivre' },
  lineAccount: { ja: 'LINE公式アカウント', en: 'LINE Official Account', fr: 'Compte officiel LINE' },
  privacy: { ja: 'プライバシーポリシー', en: 'Privacy policy', fr: 'Politique de confidentialité' },
  terms: { ja: '利用規約', en: 'Terms of use', fr: 'Conditions d’utilisation' },
  legal: { ja: '特定商取引法に基づく表記', en: 'Legal notice', fr: 'Mentions légales' },
  homestay: { ja: 'ホームステイ', en: 'Homestay', fr: 'Homestay' },
  events: { ja: 'イベント', en: 'Events', fr: 'Événements' },
  chef: { ja: 'Voilà chef（出張シェフ）', en: 'Voilà chef', fr: 'Voilà chef' },
};

// Topic shown on the contact form when a visitor arrives from a specific card
// (e.g. /?topic=celebrate_apero#contact → « Au sujet de : Voilà chef »).
// `celebrate_apero` keeps its historical key: it is what old shared links carry.
export const TOPICS = {
  trial: { ja: '無料体験レッスン', en: 'Free trial lesson', fr: 'Cours d’essai gratuit' },
  visit: { ja: 'スクール見学', en: 'School visit', fr: 'Visite de l’école' },
  ...Object.fromEntries(home.learn.cards.map((c) => [c.slot, c.title])),
  ...Object.fromEntries(home.learn.also.map((a, i) => [`also_${i}`, a])),
  ...Object.fromEntries(home.live.cards.map((c) => [c.slot, c.title])),
  celebrate_events: home.celebrate.events.title,
  celebrate_apero: { ja: 'Voilà chef（出張シェフ）', en: 'Voilà chef', fr: 'Voilà chef' },
  homestay: { ja: 'ホームステイ', en: 'Homestay', fr: 'Homestay' },
  franchise: { ja: 'フランチャイズ', en: 'Franchise', fr: 'Franchise' },
  careers: { ja: '採用応募', en: 'Job application', fr: 'Candidature' },
  other: { ja: 'その他のご質問', en: 'Other question', fr: 'Autre question' },
};

// Subject menu of the contact forms: every offer, grouped like the site.
export const TOPIC_GROUPS = [
  { label: { ja: 'Voilà Experience — レッスン', en: 'Voilà Experience — lessons', fr: 'Voilà Experience — cours' },
    keys: ['trial', 'learn_kids', 'learn_secondary', 'learn_online', 'learn_adults', 'also_0', 'also_1', 'also_2'] },
  { label: { ja: 'Voilà Homestay', en: 'Voilà Homestay', fr: 'Voilà Homestay' },
    keys: ['live_homestay', 'live_travel', 'live_camp'] },
  { label: { ja: 'Voilà Moments — イベント', en: 'Voilà Moments — events', fr: 'Voilà Moments — événements' },
    keys: ['celebrate_events', 'celebrate_apero'] },
  { label: { ja: 'その他', en: 'Other', fr: 'Autre' },
    keys: ['visit', 'franchise', 'careers', 'other'] },
];

export const topicHref = (key, path = '/', anchor = 'contact') => `${path}?topic=${key}#${anchor}`;
