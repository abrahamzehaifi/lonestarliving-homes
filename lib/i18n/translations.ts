export type Language = "en" | "es" | "ar";

export const languages: {
  code: Language;
  shortLabel: string;
  nativeLabel: string;
}[] = [
  { code: "en", shortLabel: "EN", nativeLabel: "English" },
  { code: "es", shortLabel: "ES", nativeLabel: "Español" },
  { code: "ar", shortLabel: "AR", nativeLabel: "العربية" },
];

export const translations = {
  en: {
    brand: "LonestarLiving.homes",
    intake: {
      requestLabel: "Request guidance",
      requestSubtext:
        "Share the details that matter most so the next step is clear, practical, and relevant to your situation.",
      structuredHelp:
        "A clear request helps me respond with better guidance and stronger next steps.",
      messages: {
        submitError: "Something went wrong. Please try again.",
        networkError: "Network error. Please try again.",
      },
      headings: {
        rent: "Begin rental guidance",
        buy: "Begin buyer consultation",
        sell: "Begin seller consultation",
        landlord: "Begin landlord consultation",
        other: "Begin consultation",
      },
      subtexts: {
        rent: "Share a few details about your rental search so I can respond with the most useful next step.",
        buy: "Share a few details about your purchase goals so I can respond with the most useful next step.",
        sell: "Share a few details about your property and goals so I can respond with the most useful next step.",
        landlord:
          "Share a few details about your property and leasing goals so I can respond with the most useful next step.",
        other:
          "Share a few details about what you need so I can respond with the most useful next step.",
      },
      sections: {
        contact: {
          title: "Contact details",
          text: "Start with the basics so I know how to reach you.",
        },
        searchDetails: {
          title: "Search details",
          text: "Add the practical details that help narrow the search and save time.",
        },
        buyerDetails: {
          title: "Buyer details",
          text: "Provide enough context to understand your goals, price range, and timing.",
        },
        sellerDetails: {
          title: "Seller details",
          text: "Provide the property details and sale priorities so the response can be more useful.",
        },
        landlordDetails: {
          title: "Landlord details",
          text: "Share the property basics and leasing timeline so the request can be handled more effectively.",
        },
      },
      fields: {
        fullName: "Full name",
        email: "Email",
        phone: "Phone",
        leadType: "Service type",
        timeline: "Timeline",
        timelinePlaceholder: "Timeline",
        budget: "Monthly budget",
        moveInDate: "Move-in date",
        preferredArea: "Preferred area",
        message: "Additional details",
        priceRange: "Target price range",
        financingStatus: "Financing status",
        propertyAddress: "Property address",
        sellerGoal: "Main goal",
        propertyArea: "Property area or ZIP",
        propertyType: "Property type",
        readyToLease: "Ready to lease now?",
        consent: "I consent to be contacted regarding my inquiry.",
      },
      options: {
        leadType: {
          rent: "Rent",
          buy: "Buy",
          sell: "Sell",
          landlord: "Landlord",
          other: "Other",
        },
        timeline: {
          asap: "ASAP",
          within30: "Within 30 days",
          oneToThree: "1–3 months",
          threePlus: "3+ months",
        },
        financingStatus: {
          placeholder: "Financing status",
          preapproved: "Pre-approved",
          cash: "Cash",
          needLender: "Need lender",
          exploring: "Just exploring",
        },
        sellerGoal: {
          placeholder: "Main goal",
          maxPrice: "Max price",
          fastSale: "Fast sale",
          both: "Both",
        },
        propertyType: {
          placeholder: "Property type",
          house: "House",
          condoTownhome: "Condo / townhome",
          apartmentUnit: "Apartment unit",
          other: "Other",
        },
        readyToLease: {
          placeholder: "Ready to lease now?",
          yes: "Yes",
          no: "No",
        },
      },
      placeholders: {
        fullName: "Full name",
        email: "name@email.com",
        phone: "+1 713 555 0000",
        budget: "Monthly budget",
        preferredArea: "Preferred area",
        message: "Share any useful details here.",
        priceRange: "Target price range",
        propertyAddress: "Property address",
        propertyArea: "Property area or ZIP",
        otherMessage: "Describe what you need",
      },
      otherBox: "Use the details box below to describe what you need.",
      submit: "Submit",
      sending: "Sending...",
      disclaimer:
        "Brokered by 5th Stream Realty LLC. Submitting this form does not create an agency relationship.",
    },
  },

  es: {
    brand: "LonestarLiving.homes",
    intake: {
      requestLabel: "Solicitar orientación",
      requestSubtext:
        "Comparta los detalles más importantes para que el siguiente paso sea claro, práctico y relevante para su situación.",
      structuredHelp:
        "Una solicitud clara me ayuda a responder con mejor orientación y siguientes pasos más útiles.",
      messages: {
        submitError: "Ocurrió un error. Inténtelo de nuevo.",
        networkError: "Error de red. Inténtelo de nuevo.",
      },
      headings: {
        rent: "Comenzar orientación de renta",
        buy: "Comenzar consulta para comprar",
        sell: "Comenzar consulta para vender",
        landlord: "Comenzar consulta para propietario",
        other: "Comenzar consulta",
      },
      subtexts: {
        rent: "Comparta algunos detalles sobre su búsqueda de renta para que pueda recibir una respuesta más útil.",
        buy: "Comparta algunos detalles sobre su objetivo de compra para que pueda recibir una respuesta más útil.",
        sell: "Comparta algunos detalles sobre su propiedad y sus objetivos para que pueda recibir una respuesta más útil.",
        landlord:
          "Comparta algunos detalles sobre su propiedad y sus metas de arrendamiento para que pueda recibir una respuesta más útil.",
        other:
          "Comparta algunos detalles sobre lo que necesita para que pueda recibir una respuesta más útil.",
      },
      sections: {
        contact: {
          title: "Datos de contacto",
          text: "Empiece con lo básico para saber cómo comunicarme con usted.",
        },
        searchDetails: {
          title: "Detalles de búsqueda",
          text: "Agregue los detalles prácticos que ayuden a enfocar la búsqueda y ahorrar tiempo.",
        },
        buyerDetails: {
          title: "Detalles del comprador",
          text: "Proporcione suficiente contexto para entender sus metas, rango de precio y tiempos.",
        },
        sellerDetails: {
          title: "Detalles del vendedor",
          text: "Comparta los detalles de la propiedad y sus prioridades de venta para que la respuesta sea más útil.",
        },
        landlordDetails: {
          title: "Detalles del propietario",
          text: "Comparta los datos básicos de la propiedad y el tiempo estimado para rentarla.",
        },
      },
      fields: {
        fullName: "Nombre completo",
        email: "Correo electrónico",
        phone: "Teléfono",
        leadType: "Tipo de servicio",
        timeline: "Plazo",
        timelinePlaceholder: "Plazo",
        budget: "Presupuesto mensual",
        moveInDate: "Fecha de mudanza",
        preferredArea: "Área preferida",
        message: "Detalles adicionales",
        priceRange: "Rango de precio objetivo",
        financingStatus: "Estado del financiamiento",
        propertyAddress: "Dirección de la propiedad",
        sellerGoal: "Objetivo principal",
        propertyArea: "Zona o código postal",
        propertyType: "Tipo de propiedad",
        readyToLease: "¿Lista para rentarse ahora?",
        consent:
          "Doy mi consentimiento para ser contactado con respecto a mi consulta.",
      },
      options: {
        leadType: {
          rent: "Rentar",
          buy: "Comprar",
          sell: "Vender",
          landlord: "Propietario",
          other: "Otro",
        },
        timeline: {
          asap: "Lo antes posible",
          within30: "Dentro de 30 días",
          oneToThree: "1–3 meses",
          threePlus: "Más de 3 meses",
        },
        financingStatus: {
          placeholder: "Estado del financiamiento",
          preapproved: "Preaprobado",
          cash: "Efectivo",
          needLender: "Necesito prestamista",
          exploring: "Solo explorando",
        },
        sellerGoal: {
          placeholder: "Objetivo principal",
          maxPrice: "Precio máximo",
          fastSale: "Venta rápida",
          both: "Ambos",
        },
        propertyType: {
          placeholder: "Tipo de propiedad",
          house: "Casa",
          condoTownhome: "Condominio / townhome",
          apartmentUnit: "Unidad de apartamento",
          other: "Otro",
        },
        readyToLease: {
          placeholder: "¿Lista para rentarse ahora?",
          yes: "Sí",
          no: "No",
        },
      },
      placeholders: {
        fullName: "Nombre completo",
        email: "nombre@email.com",
        phone: "+1 713 555 0000",
        budget: "Presupuesto mensual",
        preferredArea: "Área preferida",
        message: "Comparta aquí cualquier detalle útil.",
        priceRange: "Rango de precio objetivo",
        propertyAddress: "Dirección de la propiedad",
        propertyArea: "Zona o código postal",
        otherMessage: "Describa lo que necesita",
      },
      otherBox:
        "Use el cuadro de detalles a continuación para describir lo que necesita.",
      submit: "Enviar",
      sending: "Enviando...",
      disclaimer:
        "Intermediado por 5th Stream Realty LLC. Enviar este formulario no crea una relación de agencia.",
    },
  },

  ar: {
    brand: "LonestarLiving.homes",
    intake: {
      requestLabel: "طلب استشارة",
      requestSubtext:
        "أرسل التفاصيل الأساسية حتى تكون الخطوة التالية واضحة وعملية ومرتبطة باحتياجك.",
      structuredHelp:
        "كلما كان الطلب أوضح، كان الرد أكثر فائدة ودقة.",
      messages: {
        submitError: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
        networkError: "خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
      },
      headings: {
        rent: "ابدأ طلب المساعدة في الإيجار",
        buy: "ابدأ استشارة الشراء",
        sell: "ابدأ استشارة البيع",
        landlord: "ابدأ استشارة المالك",
        other: "ابدأ الاستشارة",
      },
      subtexts: {
        rent: "شارك بعض التفاصيل عن بحثك عن الإيجار حتى أتمكن من الرد بالخطوة التالية الأنسب.",
        buy: "شارك بعض التفاصيل عن هدفك في الشراء حتى أتمكن من الرد بالخطوة التالية الأنسب.",
        sell: "شارك بعض التفاصيل عن العقار وأهدافك حتى أتمكن من الرد بالخطوة التالية الأنسب.",
        landlord:
          "شارك بعض التفاصيل عن العقار وأهداف التأجير حتى أتمكن من الرد بالخطوة التالية الأنسب.",
        other:
          "شارك بعض التفاصيل عمّا تحتاجه حتى أتمكن من الرد بالخطوة التالية الأنسب.",
      },
      sections: {
        contact: {
          title: "بيانات التواصل",
          text: "ابدأ بالأساسيات حتى أعرف أفضل طريقة للتواصل معك.",
        },
        searchDetails: {
          title: "تفاصيل البحث",
          text: "أضف التفاصيل العملية التي تساعد على تضييق البحث وتوفير الوقت.",
        },
        buyerDetails: {
          title: "تفاصيل المشتري",
          text: "أدخل معلومات كافية لفهم أهدافك والنطاق السعري والتوقيت.",
        },
        sellerDetails: {
          title: "تفاصيل البائع",
          text: "أدخل تفاصيل العقار وأولوية البيع حتى يكون الرد أكثر فائدة.",
        },
        landlordDetails: {
          title: "تفاصيل المالك",
          text: "أدخل أساسيات العقار وتوقيت التأجير حتى تتم متابعة الطلب بشكل أفضل.",
        },
      },
      fields: {
        fullName: "الاسم الكامل",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        leadType: "نوع الخدمة",
        timeline: "الإطار الزمني",
        timelinePlaceholder: "الإطار الزمني",
        budget: "الميزانية الشهرية",
        moveInDate: "تاريخ الانتقال",
        preferredArea: "المنطقة المفضلة",
        message: "تفاصيل إضافية",
        priceRange: "نطاق السعر المستهدف",
        financingStatus: "حالة التمويل",
        propertyAddress: "عنوان العقار",
        sellerGoal: "الهدف الرئيسي",
        propertyArea: "منطقة العقار أو الرمز البريدي",
        propertyType: "نوع العقار",
        readyToLease: "هل العقار جاهز للتأجير الآن؟",
        consent: "أوافق على التواصل معي بخصوص استفساري.",
      },
      options: {
        leadType: {
          rent: "إيجار",
          buy: "شراء",
          sell: "بيع",
          landlord: "مالك",
          other: "أخرى",
        },
        timeline: {
          asap: "في أقرب وقت",
          within30: "خلال 30 يومًا",
          oneToThree: "1–3 أشهر",
          threePlus: "أكثر من 3 أشهر",
        },
        financingStatus: {
          placeholder: "حالة التمويل",
          preapproved: "موافقة مسبقة",
          cash: "نقدًا",
          needLender: "أحتاج إلى مقرض",
          exploring: "أستكشف فقط",
        },
        sellerGoal: {
          placeholder: "الهدف الرئيسي",
          maxPrice: "أعلى سعر",
          fastSale: "بيع سريع",
          both: "كلاهما",
        },
        propertyType: {
          placeholder: "نوع العقار",
          house: "منزل",
          condoTownhome: "كوندو / تاون هاوس",
          apartmentUnit: "وحدة شقة",
          other: "أخرى",
        },
        readyToLease: {
          placeholder: "هل العقار جاهز للتأجير الآن؟",
          yes: "نعم",
          no: "لا",
        },
      },
      placeholders: {
        fullName: "الاسم الكامل",
        email: "name@email.com",
        phone: "+1 713 555 0000",
        budget: "الميزانية الشهرية",
        preferredArea: "المنطقة المفضلة",
        message: "شارك أي تفاصيل مفيدة هنا.",
        priceRange: "نطاق السعر المستهدف",
        propertyAddress: "عنوان العقار",
        propertyArea: "منطقة العقار أو الرمز البريدي",
        otherMessage: "اشرح ما الذي تحتاجه",
      },
      otherBox: "استخدم مربع التفاصيل أدناه لشرح ما تحتاجه.",
      submit: "إرسال",
      sending: "جارٍ الإرسال...",
      disclaimer:
        "يتم التوسط من خلال 5th Stream Realty LLC. إرسال هذا النموذج لا ينشئ علاقة وكالة.",
    },
  },
} as const;

export function getLanguage(value?: string | null): Language {
  if (value === "es" || value === "ar") return value;
  return "en";
}