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
      headings: {
        rent: "Begin rental assistance",
        buy: "Begin buyer consultation",
        sell: "Begin seller consultation",
        landlord: "Begin landlord consultation",
        other: "Begin consultation",
      },
      subtexts: {
        rent: "Share a few details so your rental request can be reviewed and routed to the most appropriate next step.",
        buy: "Share a few details so your buyer request can be reviewed and routed to the most appropriate next step.",
        sell: "Share a few details so your seller request can be reviewed and routed to the most appropriate next step.",
        landlord:
          "Share a few details so your landlord request can be reviewed and routed to the most appropriate next step.",
        other:
          "Share a few details so your request can be reviewed and routed to the most appropriate next step.",
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
        screeningProfile: "Screening profile",
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
        screeningProfile: {
          placeholder: "Screening profile",
          clean: "Clean / standard screening",
          noUsCredit: "No U.S. credit history",
          creditConcern: "Credit concern",
          brokenLease: "Broken lease",
          eviction: "Eviction",
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
      rentalGate: {
        title: "Quick rental screen",
        text: "Start with these three fields so the rental request can be routed correctly.",
        continue: "Continue",
        error:
          "Please complete monthly budget, move-in date, and screening profile.",
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
      otherBox:
        "Use the details box below to describe what you need.",
      submit: "Submit",
      sending: "Sending...",
      disclaimer:
        "Brokered by 5th Stream Realty LLC. Submitting this form does not create an agency relationship.",
    },
  },

  es: {
    brand: "LonestarLiving.homes",
    intake: {
      headings: {
        rent: "Comenzar asistencia de renta",
        buy: "Comenzar consulta para comprar",
        sell: "Comenzar consulta para vender",
        landlord: "Comenzar consulta para propietario",
        other: "Comenzar consulta",
      },
      subtexts: {
        rent: "Comparta algunos detalles para que su solicitud de renta sea revisada y dirigida al siguiente paso más adecuado.",
        buy: "Comparta algunos detalles para que su solicitud de compra sea revisada y dirigida al siguiente paso más adecuado.",
        sell: "Comparta algunos detalles para que su solicitud de venta sea revisada y dirigida al siguiente paso más adecuado.",
        landlord:
          "Comparta algunos detalles para que su solicitud como propietario sea revisada y dirigida al siguiente paso más adecuado.",
        other:
          "Comparta algunos detalles para que su solicitud sea revisada y dirigida al siguiente paso más adecuado.",
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
        screeningProfile: "Perfil de evaluación",
        preferredArea: "Área preferida",
        message: "Detalles adicionales",
        priceRange: "Rango de precio objetivo",
        financingStatus: "Estado del financiamiento",
        propertyAddress: "Dirección de la propiedad",
        sellerGoal: "Objetivo principal",
        propertyArea: "Zona o código postal",
        propertyType: "Tipo de propiedad",
        readyToLease: "¿Lista para rentarse ahora?",
        consent: "Doy mi consentimiento para ser contactado con respecto a mi consulta.",
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
        screeningProfile: {
          placeholder: "Perfil de evaluación",
          clean: "Evaluación limpia / estándar",
          noUsCredit: "Sin historial de crédito en EE. UU.",
          creditConcern: "Problema de crédito",
          brokenLease: "Contrato roto",
          eviction: "Desalojo",
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
      rentalGate: {
        title: "Filtro rápido de renta",
        text: "Comience con estos tres campos para que la solicitud de renta sea dirigida correctamente.",
        continue: "Continuar",
        error:
          "Complete el presupuesto mensual, la fecha de mudanza y el perfil de evaluación.",
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
      headings: {
        rent: "ابدأ طلب المساعدة في الإيجار",
        buy: "ابدأ استشارة الشراء",
        sell: "ابدأ استشارة البيع",
        landlord: "ابدأ استشارة المالك",
        other: "ابدأ الاستشارة",
      },
      subtexts: {
        rent: "شارك بعض التفاصيل حتى تتم مراجعة طلب الإيجار وتوجيهه إلى الخطوة التالية المناسبة.",
        buy: "شارك بعض التفاصيل حتى تتم مراجعة طلب الشراء وتوجيهه إلى الخطوة التالية المناسبة.",
        sell: "شارك بعض التفاصيل حتى تتم مراجعة طلب البيع وتوجيهه إلى الخطوة التالية المناسبة.",
        landlord:
          "شارك بعض التفاصيل حتى تتم مراجعة طلب المالك وتوجيهه إلى الخطوة التالية المناسبة.",
        other:
          "شارك بعض التفاصيل حتى تتم مراجعة طلبك وتوجيهه إلى الخطوة التالية المناسبة.",
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
        screeningProfile: "ملف التقييم",
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
        screeningProfile: {
          placeholder: "ملف التقييم",
          clean: "تقييم عادي / نظيف",
          noUsCredit: "لا يوجد سجل ائتماني أمريكي",
          creditConcern: "مشكلة ائتمانية",
          brokenLease: "فسخ عقد إيجار",
          eviction: "إخلاء",
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
      rentalGate: {
        title: "فرز سريع لطلبات الإيجار",
        text: "ابدأ بهذه الحقول الثلاثة حتى يتم توجيه طلب الإيجار بشكل صحيح.",
        continue: "متابعة",
        error:
          "يرجى إكمال الميزانية الشهرية وتاريخ الانتقال وملف التقييم.",
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
      otherBox:
        "استخدم مربع التفاصيل أدناه لشرح ما تحتاجه.",
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