/**
 * Plexo's legal pages: Privacy Policy, Terms of Service and Cookie Policy. DRAFTS, written from what the
 * site itself promises (14-day trial, 7-day money back, export anytime, "you own what Sol creates", no AI
 * training without permission). They need a lawyer's review before launch.
 */

export type LegalBlock =
  | { p: string }
  | { list: string[] }
  | { table: { head: string[]; rows: string[][] } }

export type LegalSection = { id: string; title: string; blocks: LegalBlock[] }

export type LegalSlug = 'privacy' | 'terms' | 'cookies'

export type LegalDoc = {
  slug: LegalSlug
  href: string
  /** Tab label. */
  label: string
  title: string
  intro: string
  /** "The short version": the document in four lines. */
  summary: string[]
  sections: LegalSection[]
}

export const LEGAL_EMAIL = 'hello@plexopages.com'

const privacy: LegalDoc = {
  slug: 'privacy',
  href: '/privacy',
  label: 'Privacy Policy',
  title: 'Privacy Policy',
  intro: 'What we collect when you use Plexo, why we collect it, and the choices you have.',
  summary: [
    'We collect what we need to run Plexo: your account details, what you build and how you use the product.',
    'You own your content. We never sell your personal information.',
    'Sol does not use your content to train AI models without your permission.',
    'You can ask us to show you, correct, export or delete your data at any time.',
  ],
  sections: [
    {
      id: 'who-we-are',
      title: 'Who we are',
      blocks: [
        { p: 'Plexo is a website builder made by Charisol ("Plexo", "we", "us"). This policy covers plexopages.com, the Plexo editor, Sol, our MCP server, API and SDK, and the emails we send.' },
        { p: 'When you build a site on Plexo and collect information from your own visitors or customers, you decide what happens to that information. For that data you are in charge, and we handle it on your behalf.' },
      ],
    },
    {
      id: 'what-we-collect',
      title: 'What we collect',
      blocks: [
        { p: 'Information you give us:' },
        {
          list: [
            'Account details: your name, email address and password, or your Google profile if you sign in with Google.',
            'What you build: pages, prompts, text, images, files, products and email campaigns.',
            'Billing details: your plan and payment history. Card details go straight to our payment processors; we never see or store full card numbers.',
            'Messages: what you send through our contact form, support chats and emails.',
          ],
        },
        { p: 'Information we collect automatically:' },
        {
          list: [
            'Usage data: the features you use, the pages you visit and the AI credits you spend.',
            'Device data: your IP address, browser, operating system and approximate location.',
            'Cookies and similar technologies, as described in our Cookie Policy.',
          ],
        },
      ],
    },
    {
      id: 'how-we-use-it',
      title: 'How we use your information',
      blocks: [
        {
          list: [
            'To run Plexo: create your account, build and host your sites, and process your payments.',
            'To build and edit with Sol when you ask it to.',
            'To keep Plexo safe: prevent fraud, spam and abuse, and secure your account.',
            'To support you and answer your messages.',
            'To send product updates and tips. You can unsubscribe from these at any time.',
            'To improve Plexo, using usage data that is combined and does not identify you.',
            'To meet our legal obligations.',
          ],
        },
        { p: 'We only use your information where the law allows it: to provide the service you signed up for, where we have a legitimate interest that does not override your rights, where you have given consent, or where the law requires it.' },
      ],
    },
    {
      id: 'ai-and-your-content',
      title: 'AI and your content',
      blocks: [
        { p: 'When Sol, or an AI tool you connect through MCP, works on your project, your prompts and project content are processed to produce the result.' },
        { p: 'Your content is not used to train AI models without your permission. Where we use AI service providers, they process your content only to give you the result, under our contracts with them.' },
      ],
    },
    {
      id: 'sharing',
      title: 'When we share information',
      blocks: [
        { p: 'We never sell your personal information. We share it only:' },
        {
          list: [
            'With service providers who help us run Plexo, such as hosting, payments, email delivery, analytics and AI. They may use it only to provide their service to us.',
            'When you publish a site, with anyone who visits it.',
            'If Plexo is sold or merged, with the new owner, who must respect this policy.',
            'When the law requires it, or to protect the rights and safety of our users and the public.',
            'With anyone else, only when you ask us to.',
          ],
        },
      ],
    },
    {
      id: 'transfers',
      title: 'International transfers',
      blocks: [{ p: 'Our providers may store or process information outside your country. When they do, we use safeguards that the law recognises, such as standard contract terms, to keep it protected.' }],
    },
    {
      id: 'retention',
      title: 'How long we keep it',
      blocks: [
        { p: 'We keep your information while your account is open. If your trial ends or you cancel, your pages go offline but your work stays saved, so you can come back.' },
        { p: 'If you delete your account, we delete your information or make it anonymous within a reasonable period, unless the law requires us to keep it longer (for example, billing records).' },
      ],
    },
    {
      id: 'your-rights',
      title: 'Your rights',
      blocks: [
        { p: 'Depending on where you live, you can ask us to:' },
        {
          list: [
            'Show you the personal information we hold about you.',
            'Correct information that is wrong.',
            'Delete your information.',
            'Give you a copy of your information to take elsewhere.',
            'Stop or limit how we use it, or withdraw your consent.',
          ],
        },
        { p: 'Email us to make a request. You can also complain to your data protection authority, such as the Nigeria Data Protection Commission.' },
      ],
    },
    {
      id: 'security',
      title: 'Security',
      blocks: [{ p: 'We protect your information with encryption in transit, access controls and regular reviews. No system is perfectly secure, so please use a strong, unique password and tell us straight away if you think your account has been compromised.' }],
    },
    {
      id: 'children',
      title: 'Children',
      blocks: [{ p: 'Plexo is not meant for anyone under 18. We do not knowingly collect information from children. If you think a child has given us information, contact us and we will delete it.' }],
    },
    {
      id: 'changes',
      title: 'Changes to this policy',
      blocks: [{ p: 'We may update this policy as Plexo changes. If the changes are important, we will tell you by email or in the product before they take effect.' }],
    },
  ],
}

const terms: LegalDoc = {
  slug: 'terms',
  href: '/terms',
  label: 'Terms of Service',
  title: 'Terms of Service',
  intro: 'The agreement between you and Plexo when you use our website builder.',
  summary: [
    'Use Plexo lawfully, and keep your account secure.',
    'You own what you build, including everything Sol creates for you.',
    'Start free for 14 days. Paid plans come with a 7-day money-back guarantee.',
    'Cancel anytime. You can export your code and take your site with you.',
  ],
  sections: [
    {
      id: 'agreement',
      title: 'Agreeing to these terms',
      blocks: [{ p: 'These terms apply when you use Plexo, a website builder made by Charisol ("Plexo", "we", "us"). By creating an account or using Plexo, you agree to them. If you use Plexo for a business, you agree on behalf of that business.' }],
    },
    {
      id: 'account',
      title: 'Your account',
      blocks: [
        {
          list: [
            'You must be at least 18 years old to use Plexo.',
            'Give us accurate information and keep it up to date.',
            'Keep your password safe. You are responsible for everything that happens in your account.',
            'Tell us straight away if you think someone else has access to your account.',
          ],
        },
      ],
    },
    {
      id: 'plans',
      title: 'Free trial, plans and payment',
      blocks: [
        { p: 'You can try Plexo free for 14 days, with no card needed. When the trial ends, your pages go offline, but your work stays saved. Upgrade anytime to put your site live again.' },
        { p: 'Paid plans are billed monthly or yearly, in advance, at the prices on our pricing page. You can switch plans at any time; we prorate the difference. Prices do not include taxes unless we say so.' },
      ],
    },
    {
      id: 'refunds',
      title: 'Cancelling and refunds',
      blocks: [
        { p: 'You can cancel at any time from your account settings. Your plan stays active until the end of the period you have paid for.' },
        { p: 'Every paid plan has a 7-day money-back guarantee. If Plexo is not right for you, ask for a refund within 7 days of your first payment and we will refund it in full.' },
      ],
    },
    {
      id: 'ai-credits',
      title: 'AI credits',
      blocks: [{ p: 'Sol uses AI credits each time it generates or edits something. Your plan includes a monthly allowance, and you can top up anytime. Drag-and-drop edits never use credits. Our pricing page explains how many credits each plan includes.' }],
    },
    {
      id: 'your-content',
      title: 'Your content',
      blocks: [
        { p: 'You own your content: your pages, text, images, products and everything else you put on Plexo. That includes what Sol creates for you.' },
        { p: 'To run the service, you give us permission to host, copy, process and display your content. We use this permission only to provide Plexo to you. You can export your code at any time.' },
        { p: 'You are responsible for your content, and for having the rights to everything you upload.' },
      ],
    },
    {
      id: 'ai-content',
      title: 'Using AI',
      blocks: [{ p: 'Sol and connected AI tools can make mistakes, and similar prompts can give similar results for other users. Review what AI creates before you publish it, especially prices, claims and legal text.' }],
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable use',
      blocks: [
        { p: 'You must not use Plexo to:' },
        {
          list: [
            'Break the law, or help anyone else break it.',
            'Publish content that is fraudulent, hateful, violent or sexually exploitative, or that infringes anyone’s rights.',
            'Send spam, run phishing pages or spread malware.',
            'Overload, attack or try to break into Plexo or other users’ accounts.',
            'Copy or resell Plexo, or misuse our MCP server, API or SDK.',
          ],
        },
      ],
    },
    {
      id: 'stores',
      title: 'Online stores',
      blocks: [{ p: 'If you sell through Plexo, you are the seller. You are responsible for your products, prices, taxes, deliveries, refunds and your customers’ information. Payments go through your payment provider, under its own terms.' }],
    },
    {
      id: 'domains',
      title: 'Domains and integrations',
      blocks: [{ p: 'You can connect your own domain on any paid plan. Your domain stays registered with your registrar, under its terms. Other tools you connect to Plexo, such as AI assistants or WordPress, have their own terms too.' }],
    },
    {
      id: 'our-ip',
      title: 'Our intellectual property',
      blocks: [{ p: 'Plexo, our software, brand and templates belong to us. You can use our templates and design elements on sites you build with Plexo. You may not copy Plexo itself or use our brand without our permission.' }],
    },
    {
      id: 'termination',
      title: 'Suspension and termination',
      blocks: [{ p: 'We may suspend or close accounts that break these terms or put other users at risk. Where we can, we will warn you first and give you time to export your content.' }],
    },
    {
      id: 'liability',
      title: 'Disclaimers and liability',
      blocks: [
        { p: 'We work hard to keep Plexo running, but we provide it "as is" and cannot promise it will always be available or free of errors.' },
        { p: 'As far as the law allows, we are not liable for indirect losses such as lost profits or data, and our total liability is limited to what you paid us in the 12 months before the claim.' },
      ],
    },
    {
      id: 'changes',
      title: 'Changes to these terms',
      blocks: [{ p: 'We may update these terms as Plexo changes. If the changes are important, we will tell you before they take effect. If you keep using Plexo after that, you accept the new terms.' }],
    },
    {
      id: 'law',
      title: 'Governing law',
      blocks: [{ p: 'These terms are governed by the laws of the Federal Republic of Nigeria.' }],
    },
  ],
}

const cookies: LegalDoc = {
  slug: 'cookies',
  href: '/cookies',
  label: 'Cookie Policy',
  title: 'Cookie Policy',
  intro: 'How Plexo uses cookies and similar technologies, and how you can control them.',
  summary: [
    'Essential cookies keep you signed in and keep Plexo secure.',
    'Analytics cookies only run if you allow them.',
    'We do not use cookies for advertising.',
    'You can block or delete cookies in your browser settings.',
  ],
  sections: [
    {
      id: 'what-are-cookies',
      title: 'What cookies are',
      blocks: [{ p: 'Cookies are small text files that a website stores in your browser. They help the site remember you between pages and visits.' }],
    },
    {
      id: 'how-we-use-cookies',
      title: 'How we use cookies',
      blocks: [
        {
          table: {
            head: ['Type', 'What it does', 'Can you turn it off?'],
            rows: [
              ['Essential', 'Keeps you signed in, protects your account and remembers your session.', 'No. Plexo needs these to work.'],
              ['Preferences', 'Remembers choices such as your filters and settings.', 'Yes'],
              ['Analytics', 'Shows us how people use Plexo, in combined numbers, so we can improve it.', 'Yes. These only run with your consent.'],
            ],
          },
        },
        { p: 'We do not use advertising cookies, and we do not let advertisers track you on Plexo.' },
      ],
    },
    {
      id: 'your-sites',
      title: 'Cookies on sites you build',
      blocks: [{ p: 'Sites you publish with Plexo use essential cookies for security and, for online stores, to keep shopping carts working. If you add analytics or other tools to your site, you are responsible for telling your visitors and asking for their consent where the law requires it.' }],
    },
    {
      id: 'similar-technologies',
      title: 'Similar technologies',
      blocks: [{ p: 'We also use your browser’s local storage to remember small things, such as which tab you last opened. It works like a preference cookie, and you can clear it the same way.' }],
    },
    {
      id: 'managing-cookies',
      title: 'Managing cookies',
      blocks: [{ p: 'You can block or delete cookies in your browser settings. If you block essential cookies, you will not be able to sign in to Plexo.' }],
    },
    {
      id: 'changes',
      title: 'Changes to this policy',
      blocks: [{ p: 'We will update this policy if the way we use cookies changes.' }],
    },
  ],
}

export const legalDocs: LegalDoc[] = [privacy, terms, cookies]

export const legalDoc = (slug: LegalSlug) => legalDocs.find((doc) => doc.slug === slug) as LegalDoc
