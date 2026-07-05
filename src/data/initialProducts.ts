/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Review } from "../types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "nb-royal-school",
    name: "Royal School Notebook - Premium Quality",
    nameHindi: "रॉयल स्कूल नोटबुक - प्रीमियम गुणवत्ता",
    category: "School Notebooks",
    description: "Premium school notebook with ultra-smooth 70 GSM paper, sturdy double-wire soft binding, and glossy water-resistant covers. Ideal for school children of all grades.",
    descriptionHindi: "अल्ट्रा-स्मूथ 70 जीएसएम पेपर, मजबूत डबल-वायर सॉफ्ट बाइंडिंग और चमकदार पानी प्रतिरोधी कवर के साथ प्रीमियम स्कूल नोटबुक। सभी ग्रेड के स्कूली बच्चों के लिए आदर्श।",
    price: "Price on Request",
    sizes: ["A4 (29.7 x 21 cm)", "B5 (25 x 17.6 cm)", "A5 (21 x 14.8 cm)"],
    pages: [80, 120, 180, 240],
    paperGsm: [70, 80],
    bindingType: ["Soft Cover Perfect Bound", "Center Stapled", "Double Spiral"],
    coverType: ["300 GSM Art Card with Lamination", "Glossy Poly Cover"],
    availableColors: ["Royal Blue", "Crimson Red", "Forest Green", "Amber Yellow"],
    moq: 500,
    packaging: "50 Units per Carton, Shrink Wrapped",
    stockStatus: "In Stock",
    images: [
      "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/notebook-anshika-a4.jpg",
      "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/notebook-anshika-horse.jpg",
      "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/notebook-summer.jpg"
    ],
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 124
  },
  {
    id: "reg-executive-office",
    name: "Executive Office Register",
    nameHindi: "एग्जीक्यूटिव ऑफिस रजिस्टर",
    category: "Office Registers",
    description: "High-grade leatherette hardbound office register. Smudge-free 90 GSM ledger paper with clear ruling, pagination, and heavy-duty sewing. Perfect for corporate audits and logs.",
    descriptionHindi: "हाई-ग्रेड लेदरेट हार्डबाउंड ऑफिस रजिस्टर। स्पष्ट रूलिंग, पेजिनेशन और हैवी-ड्यूटी सिलाई के साथ स्मज-फ्री 90 जीएसएम लेजर पेपर। कॉर्पोरेट ऑडिट और लॉग के लिए बिल्कुल सही।",
    price: "Price on Request",
    sizes: ["FS (33 x 21 cm)", "A4 (29.7 x 21 cm)"],
    pages: [100, 200, 300, 400],
    paperGsm: [80, 90, 100],
    bindingType: ["Hardbound Leatherette Case Bound", "Section Sewn Binding"],
    coverType: ["Heavy Board Leatherette", "Hardbound Board Cover"],
    availableColors: ["Midnight Black", "Burgundy Brown", "Navy Blue"],
    moq: 200,
    packaging: "20 Units per Heavy Kraft Carton",
    stockStatus: "In Stock",
    images: [
      "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/long-register-flowers.png",
      "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/long-register-lake.png"
    ],
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 86
  },
  {
    id: "pb-lab-practical",
    name: "Standard Laboratory Practical Book",
    nameHindi: "मानक प्रयोगशाला प्रैक्टिकल बुक",
    category: "Practical Books",
    description: "Designed specifically for science students. Includes alternate blank pages for diagrams and ruled pages with precise margins. Spill-proof plastic coating over covers.",
    descriptionHindi: "विशेष रूप से विज्ञान के छात्रों के लिए डिज़ाइन किया गया। आरेखों के लिए वैकल्पिक खाली पृष्ठ और सटीक मार्जिन वाले रूलदार पृष्ठ शामिल हैं। कवर पर स्पिल-प्रूफ प्लास्टिक कोटिंग।",
    price: "Price on Request",
    sizes: ["A4 (29.7 x 21 cm)", "Standard Practical Size"],
    pages: [120, 160],
    paperGsm: [75, 80],
    bindingType: ["Stapled and Taped Spine", "Softbound Cover"],
    coverType: ["250 GSM Duplex Board with Gloss Aqua Varnish"],
    availableColors: ["Emerald Green", "Teal", "Ocean Blue"],
    moq: 300,
    packaging: "40 Units per Pack with Shrink Film",
    stockStatus: "In Stock",
    images: [
      "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/notebook-vaishnavi-skating.jpg",
      "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/notebook-vaishnavi.jpg"
    ],
    isBestSeller: false,
    isFeatured: false,
    rating: 4.7,
    reviewsCount: 42
  },
  {
    id: "db-artist-drawing",
    name: "Classic Artists Drawing Book",
    nameHindi: "क्लासिक आर्टिस्ट्स ड्राइंग बुक",
    category: "Drawing Books",
    description: "Extra thick 130 GSM acid-free cartridge paper, perfect for sketching, watercolors, pastels, and charcoal drawings. Easy-tear perforated pages and thick backing board.",
    descriptionHindi: "अतिरिक्त मोटा 130 जीएसएम एसिड-मुक्त कार्ट्रिज पेपर, स्केचिंग, वाटर कलर, पेस्टल और चारकोल ड्राइंग के लिए बिल्कुल सही। आसान फाड़ने योग्य छिद्रित पृष्ठ और मोटा बैकिंग बोर्ड।",
    price: "Price on Request",
    sizes: ["A3 Landscape (42 x 29.7 cm)", "A4 Landscape (29.7 x 21 cm)"],
    pages: [32, 48, 64],
    paperGsm: [120, 130, 150],
    bindingType: ["Spiral Bound Landscape", "Stitched Spine Landscape"],
    coverType: ["350 GSM Craft Board", "Multicolor Printed Art Board"],
    availableColors: ["Natural Kraft Brown", "Multicolor Creative Prints"],
    moq: 100,
    packaging: "25 Units per Pack",
    stockStatus: "In Stock",
    images: [
      "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/drawing-book-kids.jpg",
      "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/notebook-siya-summer.jpg"
    ],
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 95
  },
  {
    id: "sp-metallic-spiral",
    name: "Premium Metallic Spiral Notebook",
    nameHindi: "प्रीमियम मेटैलिक स्पाइरल नोटबुक",
    category: "Spiral Notebooks",
    description: "Sleek metallic PP cover spiral notebook. Comes with movable multi-subject dividers, pen holder loops, and an inner pocket. Features premium micro-perforated 80 GSM sheets.",
    descriptionHindi: "चिकना धातु पीपी कवर स्पाइरल नोटबुक। जंगम बहु-विषय डिवाइडर, पेन धारक लूप और एक आंतरिक जेब के साथ आता है। प्रीमियम माइक्रो-छिद्रित 80 जीएसएम शीट की विशेषता है।",
    price: "Price on Request",
    sizes: ["A4 (29.7 x 21 cm)", "A5 (21 x 14.8 cm)", "Pocket Size (15 x 10 cm)"],
    pages: [160, 200, 300],
    paperGsm: [80, 90],
    bindingType: ["Double Metal Wire-O Spiral", "Polypropylene Ring Spiral"],
    coverType: ["0.8mm Polypropylene Hard Cover", "Metallic Finished Cover Board"],
    availableColors: ["Rose Gold", "Titanium Gray", "Sapphire Blue", "Emerald Green"],
    moq: 200,
    packaging: "10 Units wrapped individually, 50 per Carton",
    stockStatus: "In Stock",
    images: [
      "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/spiral-notebook-a4.jpg",
      "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/notebooks-a4-set.jpg"
    ],
    isBestSeller: true,
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 154
  },
  {
    id: "wp-ruled-writing-pad",
    name: "Professional Ruled Writing Pad",
    nameHindi: "प्रोफेशनल रूल्ड राइटिंग पैड",
    category: "Writing Pads",
    description: "Top-bound professional pad with head-strip binding and perforated margins for clean page removal. Sturdy cardboard backing allows easy writing even while standing.",
    descriptionHindi: "शीर्ष-बाउंड पेशेवर पैड हेड-स्ट्रिप बाइंडिंग और साफ पृष्ठ हटाने के लिए छिद्रित मार्जिन के साथ। मजबूत कार्डबोर्ड बैकिंग खड़े होने पर भी आसान लेखन की अनुमति देता है।",
    price: "Price on Request",
    sizes: ["A4 Standard (29.7 x 21 cm)", "Legal Size (35.5 x 21.6 cm)"],
    pages: [50, 80, 100],
    paperGsm: [70, 75, 80],
    bindingType: ["Top Glued Pad", "Perforated Top Stapled"],
    coverType: ["Thick Kraft Backing, Flip Cover Soft Front"],
    availableColors: ["Sunshine Yellow", "Corporate White", "Soft Blue"],
    moq: 500,
    packaging: "100 Pads per Carton",
    stockStatus: "In Stock",
    images: [
      "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/notebooks-a4-collection.jpg"
    ],
    isBestSeller: false,
    isNewArrival: false,
    isFeatured: false,
    rating: 4.6,
    reviewsCount: 38
  },
  {
    id: "ex-board-exam-copy",
    name: "School Board Examination Copy",
    nameHindi: "स्कूल बोर्ड परीक्षा प्रति",
    category: "Exam Copies",
    description: "Standardized examination answer sheets. Formatted front-page with spaces for candidate info, barcode stickers, and official seal. Thread sewn to avoid loose pages.",
    descriptionHindi: "मानकीकृत परीक्षा उत्तर पुस्तिकाएं। उम्मीदवार की जानकारी, बारकोड स्टिकर और आधिकारिक सील के लिए स्थानों के साथ स्वरूपित मुखपृष्ठ। ढीले पन्नों से बचने के लिए धागा सिल दिया गया।",
    price: "Price on Request",
    sizes: ["Standard Exam Size (28 x 22 cm)"],
    pages: [12, 16, 20, 24, 32],
    paperGsm: [58, 60, 64],
    bindingType: ["Saddle Stitched", "Section Thread Sewn"],
    coverType: ["50 GSM Thin Maplitho Paper Cover"],
    availableColors: ["Classic Maplitho White"],
    moq: 5000,
    packaging: "500 Copies per Bulk Carton wrapped with waterproof lining",
    stockStatus: "In Stock",
    images: [
      "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/shivangi-warehouse.jpg",
      "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/promo-bulk-offer.jpg"
    ],
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: false,
    rating: 4.8,
    reviewsCount: 210
  },
  {
    id: "st-brass-ruler",
    name: "Luxury Metallic Brass Stationery Set",
    nameHindi: "लक्ज़री मेटैलिक ब्रास स्टेशनरी सेट",
    category: "Stationery",
    description: "A premium set containing a brass ruler, mathematical compass tools, mechanical engineering pencils, and heavy-gauge sharpener. Packaged in an elegant slide-open velvet-lined metal tin.",
    descriptionHindi: "पीतल के रूलर, गणितीय कम्पास टूल्स, मैकेनिकल इंजीनियरिंग पेंसिल और हैवी-गेज शार्पनर वाला एक प्रीमियम सेट। एक सुरुचिपूर्ण स्लाइड-ओपन मखमली-लाइन वाली धातु के डिब्बे में पैक किया गया।",
    price: "Price on Request",
    sizes: ["Standard Pocket Tin Size"],
    pages: [0], // No pages
    paperGsm: [0],
    bindingType: ["N/A"],
    coverType: ["Premium Brass Case"],
    availableColors: ["Gold Metallic", "Rose Gold Metallic", "Matte Carbon Black"],
    moq: 50,
    packaging: "Individually Packaged in Premium Gift Box, 20 Sets per Carton",
    stockStatus: "Low Stock",
    images: [
      "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/lifestyle-harsh.jpg",
      "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/lifestyle-anshika.jpg",
      "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/lifestyle-anshika2.jpg",
      "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/lifestyle-piyus.jpg"
    ],
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 33
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    userName: "Rajesh Kumar",
    rating: 5,
    comment: "Shri Shiv Enterprises provides the highest paper quality in Northern India. Our schools have shifted completely to their premium range of notebooks, and the feedback from parents has been exceptional.",
    commentHindi: "श्री शिव एंटरप्राइजेज उत्तरी भारत में उच्चतम पेपर गुणवत्ता प्रदान करता है। हमारे स्कूलों ने पूरी तरह से उनकी प्रीमियम रेंज की नोटबुक को अपना लिया है, और माता-पिता से मिली प्रतिक्रिया असाधारण रही है।",
    date: "2026-06-15",
    company: "Vidyalaya Stationery Distributors, Delhi"
  },
  {
    id: "rev-2",
    userName: "Anjali Gupta",
    rating: 5,
    comment: "The wire spiral notebooks are of Apple-level premium build. The polypropylene cover is durable and water resistant, and the paper smoothness is superior to international brands. Highly recommended!",
    commentHindi: "वायर स्पाइरल नोटबुक एप्पल-स्तर की प्रीमियम बिल्ड की हैं। पॉलीप्रोपाइलीन कवर टिकाऊ और पानी प्रतिरोधी है, और पेपर की चिकनाई अंतर्राष्ट्रीय ब्रांडों से बेहतर है। अत्यधिक अनुशंसित!",
    date: "2026-05-28",
    company: "Enterprise Hub & Co, Mumbai"
  },
  {
    id: "rev-3",
    userName: "Amit Shinde",
    rating: 4,
    comment: "Outstanding customer service and quotation support. Their AI quotation helper generated an instant, professional breakdown of bulk shipping and GST for our distributor network. Shri Shiv is the most trusted name for stationery wholesale.",
    commentHindi: "उत्कृष्ट ग्राहक सेवा और कोटेशन समर्थन। उनके एआई कोटेशन हेल्पर ने हमारे वितरक नेटवर्क के लिए थोक शिपिंग और जीएसटी का तत्काल, पेशेवर विवरण तैयार किया। स्टेशनरी थोक के लिए श्री शिव सबसे विश्वसनीय नाम है।",
    date: "2026-06-03",
    company: "Bharat Book Depot, Indore"
  }
];
