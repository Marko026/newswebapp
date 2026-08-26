import type { Locale } from "./i18n";

export type Story = {
  slug: string;
  category: Record<Locale, string>;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  body: Record<Locale, string[]>;
  date: Record<Locale, string>;
  author: Record<Locale, string>;
  readTime: number;
  art: "archive" | "terracotta" | "night" | "papyrus" | "map";
  artLabel: string;
  featured?: boolean;
  topic: string;
  /** Optional Payload media mapped by the CMS repository. */
  coverImage?: StoryMedia;
  seoTitle?: Record<Locale, string>;
  seoDescription?: Record<Locale, string>;
};

export type StoryMedia = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
};

export const ui = {
  ar: { latest: "أحدث الأخبار", history: "التاريخ والسياق", topics: "المواضيع", editorial: "ملاحظة تحريرية", newsletter: "النشرة الإخبارية", subscribe: "اشترك الآن", allNews: "كل الأخبار", viewAll: "عرض الكل", readMore: "اقرأ القصة", back: "العودة", search: "ابحث في الأرشيف", contact: "اتصل بنا", send: "إرسال", name: "الاسم", email: "البريد الإلكتروني", message: "رسالتك", noResults: "لا توجد نتائج بعد", related: "قصص ذات صلة", author: "بقلم", published: "نُشر", updated: "آخر تحديث", aboutTitle: "نقرأ الحاضر من خلال التاريخ", aboutText: "منصة مستقلة للأخبار والسياق والتاريخ، من مصر إلى العالم.", follow: "تابع النشرة الأسبوعية", privacy: "الخصوصية", terms: "الشروط" },
  en: { latest: "Latest stories", history: "History & context", topics: "Topics", editorial: "Editorial note", newsletter: "The newsletter", subscribe: "Subscribe now", allNews: "All news", viewAll: "View all", readMore: "Read the story", back: "Back", search: "Search the archive", contact: "Contact", send: "Send message", name: "Name", email: "Email", message: "Your message", noResults: "No results yet", related: "Related stories", author: "By", published: "Published", updated: "Updated", aboutTitle: "Reading the present through history", aboutText: "An independent platform for news, context, and history—from Egypt to the world.", follow: "Follow the weekly note", privacy: "Privacy", terms: "Terms" },
} as const;

export const stories: Story[] = [
  { slug: "memory-and-the-present", category: { ar: "التاريخ", en: "History" }, title: { ar: "بين الذاكرة والحاضر: لماذا تبقى القصص المصرية حية؟", en: "Between memory and the present: why Egyptian stories endure" }, excerpt: { ar: "قراءة في الطريقة التي يلتقي بها التاريخ المصري مع الحياة اليومية والهوية القبطية.", en: "A close look at how Egyptian history meets daily life and Coptic identity." }, body: { ar: ["التاريخ ليس مجموعة من التواريخ البعيدة. إنه الطريقة التي نتعلم بها قراءة المدينة، واللغة، والذاكرة التي نحملها معنا.", "في مصر، تعيش القصص القديمة بجانب الأسئلة الجديدة. ومن خلال هذه المسافة بين الذاكرة والحاضر يظهر معنى الهوية، لا كصورة ثابتة، بل كحوار مستمر."], en: ["History is not a collection of distant dates. It is how we learn to read a city, a language, and the memory we carry with us.", "In Egypt, old stories live beside new questions. In the distance between memory and the present, identity appears not as a fixed picture but as an ongoing conversation."] }, date: { ar: "٤ أغسطس ٢٠٢٦", en: "August 4, 2026" }, author: { ar: "هيئة التحرير", en: "The editorial desk" }, readTime: 7, art: "archive", artLabel: "ARCHIVE / 01", featured: true, topic: "history" },
  { slug: "coptic-community-future", category: { ar: "مصر", en: "Egypt" }, title: { ar: "أصوات المجتمع القبطي تتحدث عن المستقبل", en: "Coptic community voices look toward the future" }, excerpt: { ar: "شهادات وتحليل من داخل المجتمع حول التغيير، الذاكرة، والانتماء.", en: "Reporting and analysis on change, memory, and belonging." }, body: { ar: ["المجتمعات لا تُفهم من خلال العناوين وحدها. نبدأ من الأصوات اليومية التي تصف ما يتغير وما يبقى.", "هذه القصة تفتح مساحة للحوار بين التجربة الشخصية والسياق العام."], en: ["Communities cannot be understood through headlines alone. We begin with everyday voices describing what changes and what remains.", "This story makes room for a conversation between personal experience and the wider context."] }, date: { ar: "٣ أغسطس ٢٠٢٦", en: "August 3, 2026" }, author: { ar: "مينا حنا", en: "Mina Hanna" }, readTime: 5, art: "terracotta", artLabel: "CAIRO / 02", topic: "egypt" },
  { slug: "cairo-archive-cities", category: { ar: "تحليل", en: "Analysis" }, title: { ar: "ما الذي يخبرنا به أرشيف القاهرة عن مدن اليوم؟", en: "What Cairo's archive tells us about cities today" }, excerpt: { ar: "وثائق قديمة، أسئلة جديدة، وسياق يساعدنا على فهم اللحظة الحالية.", en: "Old documents, new questions, and context for the present moment." }, body: { ar: ["الأرشيف ليس مستودعاً صامتاً. كل وثيقة تقترح سؤالاً عن الطريقة التي بُنيت بها المدن وعن الأشخاص الذين عاشوا فيها.", "حين نعيد النظر في خرائط القاهرة القديمة، نرى أن المدينة كانت دائماً مشروعاً مفتوحاً."], en: ["An archive is not a silent storehouse. Every document proposes a question about how cities were built and who lived in them.", "When we look again at old maps of Cairo, we see that the city has always been an open project."] }, date: { ar: "٢ أغسطس ٢٠٢٦", en: "August 2, 2026" }, author: { ar: "يوسف جرجس", en: "Youssef Girgis" }, readTime: 9, art: "map", artLabel: "CAIRO / 03", topic: "history" },
  { slug: "voices-from-alexandria", category: { ar: "المجتمع", en: "Community" }, title: { ar: "الإسكندرية كما يراها أهلها", en: "Alexandria as seen by the people who live there" }, excerpt: { ar: "ملاحظات من مدينة تحمل طبقات من الذاكرة على كل شارع.", en: "Notes from a city carrying layers of memory in every street." }, body: { ar: ["تتغير المدن ببطء وبسرعة في الوقت نفسه. في الإسكندرية، يبقى البحر شاهداً على التحولات اليومية."], en: ["Cities change slowly and quickly at once. In Alexandria, the sea remains a witness to everyday transformations."] }, date: { ar: "١ أغسطس ٢٠٢٦", en: "August 1, 2026" }, author: { ar: "نور فخري", en: "Nour Fakhry" }, readTime: 4, art: "night", artLabel: "ALEX / 04", topic: "community" },
  { slug: "coptic-heritage-notes", category: { ar: "التراث", en: "Heritage" }, title: { ar: "ملاحظات من الذاكرة القبطية", en: "Notes from Coptic memory" }, excerpt: { ar: "كيف تحافظ الأشياء الصغيرة على قصة أكبر من عمرها؟", en: "How small objects preserve a story larger than their own age." }, body: { ar: ["في الأشياء اليومية، في الصور والكتب والأسماء، يمكن أن نجد آثاراً لذاكرة جماعية."], en: ["In everyday objects—in photographs, books, and names—we can find traces of a shared memory."] }, date: { ar: "٣١ يوليو ٢٠٢٦", en: "July 31, 2026" }, author: { ar: "هيئة التحرير", en: "The editorial desk" }, readTime: 6, art: "papyrus", artLabel: "MEMORY / 05", topic: "heritage" },
  { slug: "the-language-of-place", category: { ar: "أفكار", en: "Ideas" }, title: { ar: "لغة المكان: حين تصبح الأسماء تاريخاً", en: "The language of place: when names become history" }, excerpt: { ar: "الأسماء التي نستخدمها كل يوم تحمل خرائط صغيرة للذاكرة.", en: "The names we use each day carry small maps of memory." }, body: { ar: ["يصبح المكان أكثر وضوحاً حين نصغي إلى الأسماء التي يتركها الناس فيه."], en: ["A place becomes clearer when we listen to the names people leave in it."] }, date: { ar: "٣٠ يوليو ٢٠٢٦", en: "July 30, 2026" }, author: { ar: "سارة حبيب", en: "Sarah Habib" }, readTime: 5, art: "terracotta", artLabel: "PLACE / 06", topic: "ideas" },
];

export const topics = ["Egypt", "History", "Coptic heritage", "Community", "Ideas"];
export function getStory(slug: string) { return stories.find((story) => story.slug === slug); }
export function getRelated(story: Story) { return stories.filter((item) => item.slug !== story.slug && item.topic === story.topic).slice(0, 3); }
