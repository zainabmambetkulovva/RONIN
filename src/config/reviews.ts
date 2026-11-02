/**
 * Настоящие отзывы клиентов из 2GIS (подтверждённые отзывы, переданы владельцем клуба).
 * Текст приводится дословно; длинные отзывы сокращены по границе предложения («…»).
 * Не добавляйте сюда выдуманные или отредактированные отзывы.
 * `translations` — перевод для английской и кыргызской версии сайта (смысл и эмодзи сохранены; кыргызский желательно проверить носителю).
 */

export interface Review {
  author: string;
  /** Дата публикации/изменения на 2GIS, YYYY-MM-DD. */
  date: string;
  text: string;
  /** Перевод оригинального (русского) текста для других языков сайта. */
  translations?: { en: string; ky: string };
  source: "2GIS";
}

export const reviews: Review[] = [
  {
    author: "Айдар Бараканов",
    date: "2026-08-13",
    text: "Отличный и один из любимых компьютерных клубов. Летом прохладно, хороший персонал , чистота и порядок",
    translations: {
      en: "Great club and one of my favourite computer clubs. It's cool in summer, the staff are good, everything is clean and tidy",
      ky: "Мыкты, сүйүктүү компьютер клубдарымдын бири. Жайында салкын, кызматкерлери жакшы, таза жана тыкан",
    },
    source: "2GIS",
  },
  {
    author: "N D",
    date: "2026-04-14",
    text: "Сидели в лучшем зале, качество всего действительно на высоте. Чистая, с приглушённым приятным звуком клавиатура, gamedac для управления звуком, монитор с высокой герцовкой, а главное - железо, которое показывает хорошие цифры фпс. После игр остался очень приятный осадок, как-нибудь вернёмся с друзьями. 5/5, заслуженно!",
    translations: {
      en: "We sat in the best room, and the quality of everything is really top-notch. A clean keyboard with a quiet, pleasant sound, a GameDAC for sound control, a high-refresh-rate monitor, and most importantly hardware that delivers great FPS. We left with a really good impression and will come back with friends sometime. 5/5, well deserved!",
      ky: "Эң мыкты залда отурдук, баары чындап эле жогорку деңгээлде. Таза, үнү жумшак жана жагымдуу клавиатура, үндү башкаруу үчүн GameDAC, жогорку герцтүү монитор, эң негизгиси — FPS'ти жакшы көрсөткөн темир. Оюндан кийин абдан жагымдуу таасир калды, бир күнү достор менен дагы келебиз. 5/5, татыктуу!",
    },
    source: "2GIS",
  },
  {
    author: "Musa Aitmamatov",
    date: "2026-07-25",
    text: "Отличный компьютерный клуб, ресепшен просто супер, вежливость и качество обслуживания на высоте. Компьютеры новые, моники большие, а клавиатура не в разбитом состоянии 🤣🤣🤣 Однозначно рекомендую этот клуб.",
    translations: {
      en: "Excellent computer club, the reception is just super, politeness and quality of service are top-notch. The computers are new, the monitors are big, and the keyboards aren't smashed 🤣🤣🤣 I definitely recommend this club.",
      ky: "Мыкты компьютер клуб, ресепшн абдан сонун, сылыктык жана тейлөө сапаты жогорку деңгээлде. Компьютерлер жаңы, мониторлор чоң, клавиатуралар да сынган эмес 🤣🤣🤣 Бул клубду сөзсүз сунуштайм.",
    },
    source: "2GIS",
  },
  {
    author: "Lindou 🍂",
    date: "2026-10-12",
    text: "Ресепшен отличный с пониманием относятся к людям 👍🏻",
    translations: {
      en: "Excellent reception, they treat people with understanding 👍🏻",
      ky: "Ресепшн мыкты, адамдарга түшүнүү менен мамиле кылышат 👍🏻",
    },
    source: "2GIS",
  },
  {
    author: "Zhanaman 🦍",
    date: "2026-03-24",
    text: "Определенно один из лучших компьютерных клубов,очень доволен профессионализмом сотрудников . Администратора и сисадмины лучшие!!! Советую всем!",
    translations: {
      en: "Definitely one of the best computer clubs, very happy with the staff's professionalism. The administrators and sysadmins are the best!!! I recommend it to everyone!",
      ky: "Сөзсүз эң мыкты компьютер клубдарынын бири, кызматкерлердин кесипкөйлүгүнө абдан ыраазымын. Администраторлор жана сисадминдер эң мыкты!!! Баарына сунуштайм!",
    },
    source: "2GIS",
  },
  {
    author: "Amo Strnv",
    date: "2024-04-06",
    text: "Компьютеры на высоком уровне🔥 Приятно играть в разные игры без фризов и лагов, а самое главное почувствовал комфорт и вся эта эстетика 😍 У клуба есть одиночные комнаты с отличной периферией и где можно одному поиграть с кайфом и в тишине👍",
    translations: {
      en: "The computers are top-level🔥 It's great to play different games without freezes or lag, and most importantly I felt the comfort and all this aesthetic 😍 The club has single rooms with excellent peripherals where you can play alone, in peace and quiet, and really enjoy it👍",
      ky: "Компьютерлер жогорку деңгээлде🔥 Ар кандай оюндарды катпай, лагсыз ойноо жагымдуу, эң негизгиси ыңгайлуулукту жана ушул эстетиканы сездим 😍 Клубда мыкты перифериясы бар жеке бөлмөлөр бар, ал жерде жалгыз, тынч жана ырахаттанып ойносоң болот👍",
    },
    source: "2GIS",
  },
  {
    author: "Noors Ergesh",
    date: "2025-10-19",
    text: "Ресепше отличный, всегда можно забрлнировать и продлить, даже во время пересменки",
    translations: {
      en: "Excellent reception, you can always book and extend, even during the shift change",
      ky: "Ресепшн мыкты, ар дайым брондосо жана узартса болот, ал тургай кезметтин алмашуусунда да",
    },
    source: "2GIS",
  },
  {
    author: "Artur Djafarov",
    date: "2024-11-17",
    text: "Ronin — лучший компьютерный клуб, в котором я когда-либо был. Всё сделано для удобства игроков: мощные компьютеры, удобные кресла и качественные аксессуары. Заходишь сюда — и сразу чувствуешь, что всё продумано до мелочей. …",
    translations: {
      en: "Ronin is the best computer club I've ever been to. Everything is made for gamers' comfort: powerful computers, comfortable chairs and quality accessories. You walk in and immediately feel that every detail has been thought through. …",
      ky: "Ronin — мен барган эң мыкты компьютер клубу. Баары оюнчулардын ыңгайлуулугу үчүн жасалган: кубаттуу компьютерлер, ыңгайлуу креслолор жана сапаттуу аксессуарлар. Кирээриң менен эле баары майда-чүйдөсүнө чейин ойлонулганын сезесиң. …",
    },
    source: "2GIS",
  },
  {
    author: "N K",
    date: "2025-11-06",
    text: "Хорошее , вайбовое место . Персонал очень приятный)",
    translations: {
      en: "A good place with a great vibe. The staff are very nice)",
      ky: "Жакшы, вайбы бар жер. Кызматкерлер абдан жагымдуу)",
    },
    source: "2GIS",
  },
];
