export const WILAYAS = [
  { id: "01", ar: "أدرار", en: "Adrar", zone: "South" },
  { id: "02", ar: "الشلف", en: "Chlef", zone: "North" },
  { id: "03", ar: "الأغواط", en: "Laghouat", zone: "South" },
  { id: "04", ar: "أم البواقي", en: "Oum El Bouaghi", zone: "North" },
  { id: "05", ar: "باتنة", en: "Batna", zone: "North" },
  { id: "06", ar: "بجاية", en: "Béjaïa", zone: "North" },
  { id: "07", ar: "بسكرة", en: "Biskra", zone: "South" },
  { id: "08", ar: "بشار", en: "Béchar", zone: "South" },
  { id: "09", ar: "البليدة", en: "Blida", zone: "North" },
  { id: "10", ar: "البويرة", en: "Bouira", zone: "North" },
  { id: "11", ar: "تمنراست", en: "Tamanrasset", zone: "South" },
  { id: "12", ar: "تبسة", en: "Tébessa", zone: "North" },
  { id: "13", ar: "تلمسان", en: "Tlemcen", zone: "North" },
  { id: "14", ar: "تيارت", en: "Tiaret", zone: "North" },
  { id: "15", ar: "تيزي وزو", en: "Tizi Ouzou", zone: "North" },
  { id: "16", ar: "الجزائر العاصمة", en: "Algiers", zone: "Center" },
  { id: "17", ar: "الجلفة", en: "Djelfa", zone: "South" },
  { id: "18", ar: "جيجل", en: "Jijel", zone: "North" },
  { id: "19", ar: "سطيف", en: "Sétif", zone: "North" },
  { id: "20", ar: "سعيدة", en: "Saïda", zone: "North" },
  { id: "21", ar: "سكيكدة", en: "Skikda", zone: "North" },
  { id: "22", ar: "سيدي بلعباس", en: "Sidi Bel Abbès", zone: "North" },
  { id: "23", ar: "عنابة", en: "Annaba", zone: "North" },
  { id: "24", ar: "قالمة", en: "Guelma", zone: "North" },
  { id: "25", ar: "قسنطينة", en: "Constantine", zone: "North" },
  { id: "26", ar: "المدية", en: "Médéa", zone: "North" },
  { id: "27", ar: "مستغانم", en: "Mostaganem", zone: "North" },
  { id: "28", ar: "المسيلة", en: "M'Sila", zone: "North" },
  { id: "29", ar: "معسكر", en: "Mascara", zone: "North" },
  { id: "30", ar: "ورقلة", en: "Ouargla", zone: "South" },
  { id: "31", ar: "وهران", en: "Oran", zone: "North" },
  { id: "32", ar: "البيض", en: "El Bayadh", zone: "South" },
  { id: "33", ar: "إليزي", en: "Illizi", zone: "South" },
  { id: "34", ar: "برج بوعريريج", en: "Bordj Bou Arréridj", zone: "North" },
  { id: "35", ar: "بومرداس", en: "Boumerdès", zone: "North" },
  { id: "36", ar: "الطارف", en: "El Tarf", zone: "North" },
  { id: "37", ar: "تندوف", en: "Tindouf", zone: "South" },
  { id: "38", ar: "تيسمسيلت", en: "Tissemsilt", zone: "North" },
  { id: "39", ar: "الوادي", en: "El Oued", zone: "South" },
  { id: "40", ar: "خنشلة", en: "Khenchela", zone: "North" },
  { id: "41", ar: "سوق أهراس", en: "Souk Ahras", zone: "North" },
  { id: "42", ar: "تيبازة", en: "Tipaza", zone: "North" },
  { id: "43", ar: "ميلة", en: "Mila", zone: "North" },
  { id: "44", ar: "عين الدفلى", en: "Aïn Defla", zone: "North" },
  { id: "45", ar: "النعامة", en: "Naâma", zone: "South" },
  { id: "46", ar: "عين تموشنت", en: "Aïn Témouchent", zone: "North" },
  { id: "47", ar: "غرداية", en: "Ghardaïa", zone: "South" },
  { id: "48", ar: "غليزان", en: "Relizane", zone: "North" },
  { id: "49", ar: "المغير", en: "El M'Ghair", zone: "South" },
  { id: "50", ar: "المنيعة", en: "El Meniaa", zone: "South" },
  { id: "51", ar: "أولاد جلال", en: "Ouled Djellal", zone: "South" },
  { id: "52", ar: "برج بجي مختار", en: "Bordj Baji Mokhtar", zone: "South" },
  { id: "53", ar: "بني عباس", en: "Béni Abbès", zone: "South" },
  { id: "54", ar: "تيميمون", en: "Timimoun", zone: "South" },
  { id: "55", ar: "تقرت", en: "Touggourt", zone: "South" },
  { id: "56", ar: "جانت", en: "Djanet", zone: "South" },
  { id: "57", ar: "عين صالح", en: "In Salah", zone: "South" },
  { id: "58", ar: "عين قزام", en: "In Guezzam", zone: "South" }
];

export const SHIPPING_RATES = {
  HOME: { Center: 400, North: 600, South: 900 },
  DESK: { Center: 300, North: 450, South: 750 }
};

export const getShippingCost = (wilayaId: string, isHomeDelivery: boolean = true) => {
  const wilaya = WILAYAS.find(w => w.id === wilayaId);
  if (!wilaya) return 700; 

  const type = isHomeDelivery ? "HOME" : "DESK";
  const zone = wilaya.zone as keyof typeof SHIPPING_RATES.HOME;

  return SHIPPING_RATES[type][zone] || 700;
};
