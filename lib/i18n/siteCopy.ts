import type { SiteLang } from "./getLang";

export const siteCopy: Record<
  SiteLang,
  {
    nav: {
      rent: string;
      medical: string;
      rice: string;
      relocation: string;
      buy: string;
      sell: string;
      landlords: string;
      apply: string;
    };
    header: {
      name: string;
      title: string;
      call: string;
      email: string;
    };
    footer: {
      contact: string;
      notices: string;
      brokerInfo: string;
      english: string;
      spanish: string;
      arabic: string;
      description: string;
    };
  }
> = {
  en: {
    nav: {
      rent: "Rent",
      medical: "Medical Center Housing",
      rice: "Rice Student Housing",
      relocation: "Relocation",
      buy: "Buy",
      sell: "Sell",
      landlords: "Landlords",
      apply: "Get Started",
    },
    header: {
      name: "Abraham Zehaifi",
      title: "Texas REALTOR® | Brokered by 5th Stream Realty LLC",
      call: "Call",
      email: "Email",
    },
    footer: {
      contact: "Contact",
      notices: "Notices",
      brokerInfo: "Broker Information",
      english: "English",
      spanish: "Español",
      arabic: "العربية",
      description:
        "Houston real estate guidance for renters, buyers, sellers, landlords, and relocation clients.",
    },
  },

  es: {
    nav: {
      rent: "Rentas",
      medical: "Vivienda en el Centro Médico",
      rice: "Vivienda para Estudiantes de Rice",
      relocation: "Reubicación",
      buy: "Comprar",
      sell: "Vender",
      landlords: "Propietarios",
      apply: "Comenzar",
    },
    header: {
      name: "Abraham Zehaifi",
      title: "Texas REALTOR® | Brokered by 5th Stream Realty LLC",
      call: "Llamar",
      email: "Correo",
    },
    footer: {
      contact: "Contacto",
      notices: "Avisos",
      brokerInfo: "Información del Bróker",
      english: "English",
      spanish: "Español",
      arabic: "العربية",
      description:
        "Orientación inmobiliaria en Houston para inquilinos, compradores, vendedores, propietarios y clientes en reubicación.",
    },
  },

  ar: {
    nav: {
      rent: "الإيجار",
      medical: "سكن المركز الطبي",
      rice: "سكن طلاب رايس",
      relocation: "الانتقال",
      buy: "شراء",
      sell: "بيع",
      landlords: "المُلّاك",
      apply: "ابدأ الآن",
    },
    header: {
      name: "Abraham Zehaifi",
      title: "Texas REALTOR® | Brokered by 5th Stream Realty LLC",
      call: "اتصل",
      email: "البريد الإلكتروني",
    },
    footer: {
      contact: "التواصل",
      notices: "الإشعارات",
      brokerInfo: "معلومات الوسيط",
      english: "English",
      spanish: "Español",
      arabic: "العربية",
      description:
        "إرشاد عقاري في هيوستن للمستأجرين والمشترين والبائعين والمُلّاك والعملاء المنتقلين.",
    },
  },
};