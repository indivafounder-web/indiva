import type { Client } from "@libsql/client";
import bcrypt from "bcryptjs";

const U = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export async function seedIfEmpty(db: Client) {
  const existing = await db.execute("SELECT COUNT(*) AS c FROM users");
  const c = Number((existing.rows[0] as any)?.c || 0);
  if (c > 0) return;

  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  await db.execute({
    sql: `INSERT INTO users (name,email,password_hash,role,phone,city,state) VALUES
      (?,?,?,?,?,?,?), (?,?,?,?,?,?,?), (?,?,?,?,?,?,?), (?,?,?,?,?,?,?), (?,?,?,?,?,?,?)`,
    args: [
      "Ananya Rao", "admin@indiva.in", hash("Indiva@2026"), "admin", "+91 98765 00001", "Mumbai", "Maharashtra",
      "Meera Devi", "seller@indiva.in", hash("Seller@2026"), "seller", "+91 98765 00002", "Kanchipuram", "Tamil Nadu",
      "Arjun Mehta", "customer@indiva.in", hash("Customer@2026"), "customer", "+91 98765 00003", "Bengaluru", "Karnataka",
      "Priya Sharma", "priya@indiva.in", hash("Customer@2026"), "customer", "+91 98765 00004", "Delhi", "Delhi",
      "Ramesh Weaver", "ramesh@indiva.in", hash("Seller@2026"), "seller", "+91 98765 00005", "Varanasi", "Uttar Pradesh",
    ],
  });

  const cats = [
    ["Fashion & Textiles", "fashion", "Sarees, shawls, fabrics and heritage weaves from every state.", "/brand/cat-fashion.jpg", "👗"],
    ["Home & Décor", "decor", "Pottery, woodcraft, paintings and museum-grade objects for the home.", "/brand/cat-decor.jpg", "🏺"],
    ["Gourmet Foods", "gourmet", "Teas, spices, pickles and regional delicacies with GI provenance.", "/brand/cat-gourmet.jpg", "🍵"],
    ["Wellness", "wellness", "Ayurveda, oils, soaps and ritual care rooted in Indian pharmacopeia.", "/brand/cat-wellness.jpg", "🪔"],
    ["Jewelry & Lifestyle", "lifestyle", "Temple jewelry, bags, kolhapuris and everyday luxury accessories.", "/brand/cat-jewelry.jpg", "💍"],
  ];
  for (const c of cats) {
    await db.execute({
      sql: "INSERT INTO categories (name,slug,description,image,icon) VALUES (?,?,?,?,?)",
      args: c,
    });
  }

  const states: Array<[string, string, string, string, string, string, number]> = [
    ["Andhra Pradesh", "andhra-pradesh", "South", "Kalamkari & Kondapalli", "Painted cloth and wooden toys from the Krishna delta.", U("photo-1578662996442-48f60103fc96"), 0],
    ["Arunachal Pradesh", "arunachal-pradesh", "Northeast", "Monpa crafts", "Highland weaving and bamboo from the eastern Himalaya.", U("photo-1506905925346-21bda4d32df4"), 0],
    ["Assam", "assam", "Northeast", "Muga silk, tea & bamboo", "Golden muga, orthodox tea and living bamboo craft.", U("photo-1564890369478-c89ca6d9cde9"), 0],
    ["Bihar", "bihar", "East", "Madhubani", "Myth painted in natural dyes by women of Mithila.", U("photo-1579783902614-a3fb3927b6a5"), 0],
    ["Chhattisgarh", "chhattisgarh", "Central", "Dhokra & bell metal", "Lost-wax bronze that has survived 4,000 years.", U("photo-1610701596007-11502861dcfa"), 0],
    ["Goa", "goa", "West", "Bebinca & azulejos", "Indo-Portuguese kitchens and painted tiles.", U("photo-1512343879784-a960bf40e7f2"), 0],
    ["Gujarat", "gujarat", "West", "The Land of Threads & Thalis", "Bandhani, Patola, agate and the language of celebration.", "/brand/month-gujarat.jpg", 1],
    ["Haryana", "haryana", "North", "Phulkari", "Flower-work embroidery of the northern plains.", U("photo-1617627143750-d86bc21e42bb"), 0],
    ["Himachal Pradesh", "himachal-pradesh", "North", "Kullu shawls", "Wool, salt and mountain dye traditions.", U("photo-1626621341517-bbf3dda6370a"), 0],
    ["Jharkhand", "jharkhand", "East", "Tussar & dhokra", "Wild silk and tribal metal from the plateau.", U("photo-1590736969955-71cc94901354"), 0],
    ["Karnataka", "karnataka", "South", "Mysore silk & sandalwood", "Royal weaves, incense and filter coffee.", U("photo-1447933601403-0c6688de566e"), 0],
    ["Kerala", "kerala", "South", "Spices & Ayurveda", "Pepper coast, coconut and 5,000-year medicine.", U("photo-1596040033229-a9821f5d0c4e"), 0],
    ["Madhya Pradesh", "madhya-pradesh", "Central", "Chanderi & Maheshwari", "Sheer silks named after the towns that still weave them.", U("photo-1610030469983-98e550d6193c"), 0],
    ["Maharashtra", "maharashtra", "West", "Paithani, Warli & Kolhapuri", "Gold-bordered silk, tribal painting, hand-stitched leather.", U("photo-1603808033192-082d166bdab5"), 0],
    ["Manipur", "manipur", "Northeast", "Black rice & pottery", "Chakhao rice and the potters of Thongjao.", U("photo-1536304993881-ff6e9e85a0f6"), 0],
    ["Meghalaya", "meghalaya", "Northeast", "Eri silk & bamboo", "Peace silk and living-root craft of the Khasi hills.", U("photo-1595348020949-87cdfbb44174"), 0],
    ["Mizoram", "mizoram", "Northeast", "Puanchei shawls", "Geometric weaves of the Mizo highlands.", U("photo-1558171813-4c0887532fa3"), 0],
    ["Nagaland", "nagaland", "Northeast", "Tribal jewelry", "Beadwork and warrior cloth of the Naga tribes.", U("photo-1515562141207-7a88fb7ce338"), 0],
    ["Odisha", "odisha", "East", "Pattachitra & filigree", "Palm-leaf painting and silver that looks like lace.", U("photo-1617038260897-41a1f14a8ca0"), 0],
    ["Punjab", "punjab", "North", "Phulkari & juttis", "Garden embroidery and leather that dances.", U("photo-1601924994987-69e26d50dc26"), 0],
    ["Rajasthan", "rajasthan", "West", "Blue pottery & block print", "Desert colour, Bagru blocks and Jaipur blue.", U("photo-1565193566173-7a0ee3dbe261"), 0],
    ["Sikkim", "sikkim", "Northeast", "Tea & thangka", "High-grown leaf and Buddhist pigment.", U("photo-1576092768241-dec231879fc3"), 0],
    ["Tamil Nadu", "tamil-nadu", "South", "Kanjivaram & temple jewelry", "Silk that is weighed in gold zari.", U("photo-1610030469983-98e550d6193c"), 1],
    ["Telangana", "telangana", "South", "Pochampally & Bidri", "Ikat geometry and silver-inlaid metal.", U("photo-1610701596007-11502861dcfa"), 0],
    ["Tripura", "tripura", "Northeast", "Cane & bamboo", "The quiet architecture of the northeast.", U("photo-1595348020949-87cdfbb44174"), 0],
    ["Uttar Pradesh", "uttar-pradesh", "North", "Banarasi, chikankari & attar", "The loom of Varanasi and the perfume of Kannauj.", U("photo-1617627143750-d86bc21e42bb"), 1],
    ["Uttarakhand", "uttarakhand", "North", "Ringal & hill wool", "Himalayan bamboo and hand-spun warmth.", U("photo-1626621341517-bbf3dda6370a"), 0],
    ["West Bengal", "west-bengal", "East", "Kantha, Darjeeling & terracotta", "Running stitch, first-flush tea, Bankura horses.", U("photo-1578749556568-bc2c40e68b61"), 0],
    ["Delhi", "delhi", "North", "Zardozi & miniature", "Mughal metal thread and the capital's ateliers.", U("photo-1587474260584-136574528ed5"), 0],
  ];
  for (const s of states) {
    await db.execute({
      sql: "INSERT INTO states (name,slug,region,tagline,story,image,featured) VALUES (?,?,?,?,?,?,?)",
      args: s,
    });
  }

  const artisans = [
    [2, "Meera Devi", "Kanchipuram", "Tamil Nadu", "Kanjivaram weaving", "Third-generation silk weaver. Every saree takes 15–40 days on a pit loom. 70% of every sale returns to her family loom.", "/brand/artisan.jpg", 1, 1, "Kanchi Silk SHG", 28, 186400, 12400],
    [5, "Ramesh Weaver", "Varanasi", "Uttar Pradesh", "Banarasi brocade", "Master of kadhua weaving. His atelier holds a GI workshop certificate and trains 12 apprentices.", U("photo-1601924994987-69e26d50dc26", 700), 1, 0, "Ganga Loom Collective", 34, 242000, 18000],
    [null, "Fatima Bano", "Lucknow", "Uttar Pradesh", "Chikankari", "Leads a 40-woman chikankari unit. Each kurta is hand-embroidered over 8–12 days.", U("photo-1594736797933-d0501ba2fe65", 700), 1, 1, "Awadh Needle SHG", 19, 98000, 6200],
    [null, "Lakshmi Patil", "Kolhapur", "Maharashtra", "Kolhapuri chappals", "The original craft Prada copied. Lakshmi cuts, stitches and brands every pair herself.", U("photo-1603808033192-082d166bdab5", 700), 1, 1, "Kolhapur Leather SHG", 22, 76000, 5100],
    [null, "Govind Kumhar", "Jaipur", "Rajasthan", "Blue pottery", "Fires quartz-glazed blue pottery without clay — a Persian-Jaipur secret.", U("photo-1565193566173-7a0ee3dbe261", 700), 1, 0, "Sanganer Potters", 31, 54000, 3900],
    [null, "Anjali Das", "Madhubani", "Bihar", "Madhubani painting", "Natural-dye painter of Mithila. GI-tagged motifs, no chemical pigment.", U("photo-1579783902614-a3fb3927b6a5", 700), 1, 1, "Mithila Women Artists", 16, 41000, 2800],
    [null, "Yusuf Rather", "Srinagar", "Jammu & Kashmir", "Pashmina", "Hand-spun changthangi wool, kani woven. No machine, no blend.", U("photo-1601924994987-69e26d50dc26", 700), 1, 0, "Kashmir Loom House", 27, 210000, 15000],
    [null, "Thankam Nair", "Idukki", "Kerala", "Spices & Ayurveda", "Cardamom hills farmer and Ayurveda formulator. Organic, plastic-free.", U("photo-1596040033229-a9821f5d0c4e", 700), 0, 1, "Idukki Spice SHG", 18, 33000, 2100],
    [null, "Sita Murmu", "Mayurbhanj", "Odisha", "Dhokra & filigree", "Lost-wax caster who also finishes silver filigree for temple jewelry.", U("photo-1617038260897-41a1f14a8ca0", 700), 1, 1, "Mayurbhanj Metal SHG", 21, 47000, 3400],
    [null, "Parvati Ben", "Bhuj", "Gujarat", "Bandhani", "Ties 4,000 knots by hand for a single odhani. This month's featured maker.", "/brand/month-gujarat.jpg", 1, 1, "Kutch Bandhani SHG", 24, 89000, 7200],
  ];
  for (const a of artisans) {
    await db.execute({
      sql: `INSERT INTO artisans (user_id,name,village,state,craft,bio,photo,gi_certified,women_led,shg_name,years_experience,income_total,savings)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: a as any[],
    });
  }

  type P = any[];
  const products: P[] = [
    ["IND-TN-KS-001", "Kanjivaram Bridal Silk Saree", "kanjivaram-bridal-silk-saree",
      "Handwoven Kanchipuram silk with pure zari temple border. A heirloom piece — 22 days on a pit loom.",
      "Meera Devi's family has woven for the Kamakshi temple town for three generations. This bridal kanjivaram uses 2,200 g of silk and real gold-plated zari.",
      18500, 150, 24900, 1, 23, 1, "/brand/cat-fashion.jpg", 8, 1, 1, "Kanchipuram Silk", 4.9, 214, 86, 1, "5007.20", 900, "Mulberry silk, zari", "Dry clean only. Store in muslin.", "Kanchipuram", "Pit loom, 15–40 days", "Plastic-free bamboo box, artisan story card"],
    ["IND-UP-BN-002", "Banarasi Kadhua Brocade Saree", "banarasi-kadhua-brocade-saree",
      "Pure kadhua Banarasi — each motif woven separately, never cut. Midnight maroon with gold jaal.",
      "Ramesh Weaver's kadhua technique is GI-protected. Unlike cheap power-loom copies, every flower is independently woven into the silk.",
      22000, 175, 28900, 1, 26, 2, U("photo-1617627143750-d86bc21e42bb"), 6, 1, 1, "Banaras Brocade", 4.8, 167, 54, 1, "5007.20", 850, "Silk, gold zari", "Dry clean. Keep away from perfume.", "Varanasi", "Kadhua brocade, 25 days", "Acid-free tissue, QR passport"],
    ["IND-JK-PS-003", "Handmade Pashmina Shawl", "handmade-pashmina-shawl",
      "100% changthangi pashmina, hand-spun and kani-woven in Srinagar. So fine it passes through a ring.",
      "Yusuf Rather sources wool from Changthang herders. No nylon blend — a lab-test card ships with every shawl.",
      12500, 110, 16900, 1, 9, 7, U("photo-1601924994987-69e26d50dc26"), 11, 1, 1, "Kashmir Pashmina", 4.9, 302, 140, 1, "6214.20", 180, "Changthangi pashmina", "Hand wash cold. Lay flat.", "Srinagar", "Hand spin + kani weave, 18 days", "Muslin wrap, GI hologram"],
    ["IND-GJ-BD-004", "Bandhani Bridal Odhani", "bandhani-bridal-odhani",
      "Kutch bandhani with 4,000 hand-tied knots in maroon and turmeric gold. This month's Gujarat collection.",
      "Parvati Ben ties every knot. When the cloth is dyed and opened, a galaxy of tiny dots appears — the signature of true bandhani.",
      4500, 48, 6200, 1, 7, 10, "/brand/month-gujarat.jpg", 14, 1, 1, "Bandhani of Gujarat", 4.7, 128, 91, 1, "6211.43", 250, "Gajji silk", "Gentle hand wash.", "Bhuj, Kutch", "Tie-resist dye, 10 days", "Cotton pouch, story card"],
    ["IND-UP-CK-005", "Lucknow Chikankari Kurta Set", "lucknow-chikankari-kurta-set",
      "Hand-embroidered mulmul kurta and palazzo. Shadow work, murri and keelkachhi stitches.",
      "Fatima Bano's 40-woman unit in old Lucknow. No machine embroidery — each motif is drawn, then stitched from the reverse.",
      2800, 36, 3900, 1, 26, 3, U("photo-1594736797933-d0501ba2fe65"), 22, 2, 1, "Lucknow Chikankari", 4.6, 241, 188, 1, "6204.42", 320, "Cotton mulmul", "Hand wash separately.", "Lucknow", "Hand embroidery, 8–12 days", "Kraft box, seed paper tag"],
    ["IND-AS-MK-006", "Assam Muga Silk Mekhela Chador", "assam-muga-mekhela-chador",
      "Natural golden muga silk — the only silk that shines more with every wash. Traditional two-piece set.",
      "Woven on a throw-shuttle loom in Sualkuchi. Muga is GI-tagged and cannot be commercially farmed outside Assam.",
      8900, 85, 11900, 1, 3, 1, U("photo-1564890369478-c89ca6d9cde9"), 7, 1, 1, "Muga Silk of Assam", 4.8, 76, 33, 1, "5007.20", 480, "Muga silk", "Dry clean. Avoid sunlight storage.", "Sualkuchi", "Throw shuttle loom, 20 days", "Bamboo box"],
    ["IND-PB-PH-007", "Punjab Phulkari Dupatta", "punjab-phulkari-dupatta",
      "Bagh-style phulkari — the entire field covered in silk floss flowers. Wedding heirloom grade.",
      "Stitched from the reverse so the front is a dense garden. A craft UNESCO has flagged as endangered.",
      3200, 40, 4500, 1, 20, 3, U("photo-1558171813-4c0887532fa3"), 18, 2, 0, "", 4.5, 94, 70, 0, "6214.90", 220, "Khaddar, silk floss", "Dry clean.", "Patiala", "Darn stitch embroidery, 14 days", "Cotton wrap"],
    ["IND-RJ-KT-008", "Kota Doria Saree", "kota-doria-saree",
      "Checked cotton-silk kota from Kaithoon. Light as air, made for Indian summers.",
      "The square 'khats' are the GI signature. Woven by women on traditional pit looms in Rajasthan.",
      3600, 42, 4900, 1, 21, 5, U("photo-1610030469983-98e550d6193c"), 16, 2, 1, "Kota Doria", 4.4, 61, 44, 0, "5007.90", 310, "Cotton-silk", "Gentle wash.", "Kaithoon", "Pit loom, 7 days", "Paper sleeve"],
    ["IND-RJ-BP-009", "Jaipur Blue Pottery Vase", "jaipur-blue-pottery-vase",
      "Quartz-glazed blue pottery — no clay. Hand-painted iris and vine on a 12-inch vase.",
      "Govind Kumhar fires at low temperature with a glaze of quartz, glass and fuller's earth. A Persian gift to Jaipur, now GI-tagged.",
      2400, 30, 3200, 2, 21, 5, "/brand/cat-decor.jpg", 24, 1, 1, "Blue Pottery of Jaipur", 4.7, 188, 120, 1, "6913.90", 1100, "Quartz glaze ceramic", "Wipe. Not dishwasher.", "Jaipur", "Hand thrown, painted, low fired", "Shockproof recycled pulp"],
    ["IND-WB-TH-010", "Bankura Terracotta Horse", "bankura-terracotta-horse",
      "The iconic long-necked Bankura horse — Bengal's most photographed craft object. 14 inch.",
      "Hollow, coiled and fired in an open kiln. Once a temple offering, now a modernist icon.",
      1800, 28, 2400, 2, 28, 6, U("photo-1578749556568-bc2c40e68b61"), 19, 2, 1, "Bankura Horse", 4.6, 143, 98, 1, "6913.90", 900, "Terracotta", "Indoor display.", "Panchmura, Bankura", "Coil built, open kiln", "Hay wrap, no plastic"],
    ["IND-BH-MD-011", "Madhubani Tree of Life Painting", "madhubani-tree-of-life",
      "Natural-dye Madhubani on handmade paper. 18×24 inch, framed in untreated teak.",
      "Anjali Das paints with soot, turmeric, duppy flower and cow-dung washed paper — the Mithila way.",
      3800, 45, 5200, 2, 4, 6, U("photo-1579783902614-a3fb3927b6a5"), 12, 1, 1, "Madhubani Paintings", 4.8, 119, 67, 1, "9701.10", 800, "Handmade paper, natural dye", "Avoid direct sun.", "Madhubani", "Nib and twig, 5 days", "Corner protectors, story booklet"],
    ["IND-MH-WR-012", "Warli Art Teak Panel", "warli-art-teak-panel",
      "White-on-mud Warli procession painted on a 24-inch teak panel. Tribal geometry, contemporary object.",
      "Painted with rice paste on geru ground. Warli is a living language of the Warli people of Palghar.",
      2100, 32, 2900, 2, 14, 4, U("photo-1579783900874-fda85ed130ac"), 15, 2, 0, "", 4.5, 88, 51, 0, "4420.10", 1500, "Teak, rice paste", "Dust with dry cloth.", "Palghar", "Geru ground + rice paste", "FSC crate"],
    ["IND-OD-DK-013", "Dhokra Tribal Figurine", "dhokra-tribal-figurine",
      "Lost-wax bronze of a musician. 9 inch. 4,000-year-old technique still practised in Mayurbhanj.",
      "Sita Murmu coils beeswax threads over clay, wraps in river mud, and pours brass. The wax burns away — one chance to cast.",
      3100, 38, 4200, 2, 19, 9, U("photo-1610701596007-11502861dcfa"), 13, 1, 0, "", 4.7, 97, 58, 1, "8306.29", 700, "Brass, lost wax", "Wipe with dry cloth.", "Mayurbhanj", "Lost-wax, 6 days", "Jute nest"],
    ["IND-JK-PM-014", "Kashmiri Papier-Mâché Box", "kashmiri-papier-mache-box",
      "Hand-painted gold naqashi box. Lined in velvet. For jewelry or attar vials.",
      "Layers of handmade paper, plastered, then painted with squirrel-hair brushes. A Mughal craft that never left Srinagar.",
      2200, 30, 3000, 2, 9, 7, U("photo-1565193566173-7a0ee3dbe261"), 20, 2, 1, "Kashmir Papier Mache", 4.6, 74, 49, 0, "4823.90", 350, "Paper pulp, gold leaf", "Keep dry.", "Srinagar", "Layer, lacquer, naqashi", "Velvet pouch"],
    ["IND-KA-RW-015", "Mysore Rosewood Inlay Box", "mysore-rosewood-inlay-box",
      "Ivory-alternative resin inlay on rosewood. Palace-atelier geometry.",
      "The inlay craft of Mysore once used ivory. INDIVA artisans now use ethically sourced resin and bone-white acrylic.",
      4500, 55, 5900, 2, 11, 5, U("photo-1610701596007-11502861dcfa"), 9, 1, 0, "", 4.8, 52, 28, 0, "4420.90", 600, "Rosewood, resin inlay", "Polish with dry cloth.", "Mysuru", "Hand inlay, 8 days", "Felt-lined crate"],
    ["IND-WB-DT-016", "Darjeeling First Flush Tea — 100g", "darjeeling-first-flush-tea",
      "Muscatel first flush from a single estate. GI-tagged Darjeeling, never blended.",
      "Plucked in March at 2,000 m. The champagne of teas. Each tin is QR-traced to the garden and the day's lot.",
      890, 18, 1200, 3, 28, 8, U("photo-1576092768241-dec231879fc3"), 40, 1, 1, "Darjeeling Tea", 4.9, 410, 320, 1, "0902.40", 180, "Camellia sinensis", "Store airtight, away from light.", "Darjeeling", "Orthodox, two leaves and a bud", "Steel tin, no plastic"],
    ["IND-AS-OT-017", "Assam Orthodox Tea — 250g", "assam-orthodox-tea",
      "Full-bodied breakfast orthodox from the Brahmaputra valley. Malt, cocoa, honey.",
      "Small-grower lot, not CTC dust. Supports a women-led plucking collective.",
      650, 14, 890, 3, 3, 8, U("photo-1564890369478-c89ca6d9cde9"), 55, 2, 0, "", 4.6, 266, 210, 0, "0902.40", 320, "Camellia sinensis", "Airtight.", "Jorhat", "Orthodox roll", "Kraft tin"],
    ["IND-KL-BP-018", "Malabar Black Pepper — 200g", "malabar-black-pepper",
      "Tellicherry extra bold. Sun-dried on bamboo mats in Idukki.",
      "Thankam Nair's family garden. GI-tagged Malabar pepper — the spice that built the spice route.",
      420, 12, 560, 3, 12, 8, U("photo-1596040033229-a9821f5d0c4e"), 70, 2, 1, "Malabar Pepper", 4.8, 198, 176, 1, "0904.11", 250, "Piper nigrum", "Airtight, whole.", "Idukki", "Sun dried, 10 days", "Glass jar"],
    ["IND-JK-SF-019", "Kashmir Mongra Saffron — 2g", "kashmir-mongra-saffron",
      "Lacha mongra, deep crimson, ISO 3632 Grade I. The most expensive spice in the world, grown in Pampore.",
      "Hand-picked at dawn. Three stigmas per flower. INDIVA lab-tests every lot for crocin.",
      18500, 160, 22000, 3, 9, 7, U("photo-1509358271058-acd22cc93898"), 15, 1, 1, "Kashmir Saffron", 4.9, 87, 41, 1, "0910.20", 40, "Crocus sativus", "Dark, cool, airtight.", "Pampore", "Dawn harvest, hand separated", "Double glass vial"],
    ["IND-KA-FC-020", "Coorg Filter Coffee — 250g", "coorg-filter-coffee",
      "Peaberry roast from a shade-grown Coorg estate. South Indian filter grind.",
      "Arabica peaberry, drum roasted in small batches. Pairs with a brass davara-tumbler (sold separately).",
      380, 11, 520, 3, 11, 8, U("photo-1447933601403-0c6688de566e"), 80, 2, 0, "", 4.5, 233, 190, 0, "0901.21", 280, "Coffea arabica", "Use within 6 weeks of opening.", "Kodagu", "Shade grown, drum roast", "Valve bag, compostable"],
    ["IND-MN-BR-021", "Manipur Chakhao Black Rice — 500g", "manipur-chakhao-black-rice",
      "Forbidden rice of Manipur. Nutty, antioxidant-rich, GI-tagged.",
      "Grown in valley paddies without chemical input. Turns deep purple when cooked.",
      540, 13, 720, 3, 15, 8, U("photo-1536304993881-ff6e9e85a0f6"), 45, 2, 1, "Chakhao", 4.6, 71, 60, 0, "1006.30", 520, "Oryza sativa (black)", "Cool dry store.", "Imphal valley", "Organic paddy", "Cloth bag"],
    ["IND-AP-AV-022", "Andhra Avakaya Mango Pickle — 500g", "andhra-avakaya-pickle",
      "Sun-cured avakaya with mustard, red chilli and gingelly oil. Grandmother-grade heat.",
      "Made in small batches in Guntur. No preservatives. Ships in glass, not plastic.",
      350, 10, 480, 3, 1, 8, U("photo-1596040033229-a9821f5d0c4e"), 36, 3, 0, "", 4.7, 154, 140, 0, "2001.90", 720, "Mango, mustard, chilli, sesame oil", "Use a dry spoon.", "Guntur", "Sun cured, 7 days", "Glass jar"],
    ["IND-KL-AO-023", "Kerala Ayurvedic Hair Oil — 200ml", "kerala-ayurvedic-hair-oil",
      "Bhringraj, amla, hibiscus and coconut, slow-infused 21 days. Thankam's family recipe.",
      "Classical taila kalpana. No mineral oil, no perfume. The bottle is amber glass.",
      680, 16, 890, 4, 12, 8, "/brand/cat-wellness.jpg", 48, 2, 0, "", 4.8, 276, 210, 1, "3305.90", 280, "Herbal coconut taila", "Patch test. External use.", "Idukki", "21-day infusion", "Amber glass"],
    ["IND-KA-SS-024", "Mysore Sandalwood Soap Trio", "mysore-sandalwood-soap-trio",
      "Three cold-process soaps with GI Mysore sandalwood oil. Temple-clean scent.",
      "Sandalwood from legally sourced Karnataka oil. Wrapped in handmade paper, not plastic.",
      240, 9, 360, 4, 11, 5, U("photo-1608571423902-eed4a5ad8108"), 90, 2, 1, "Mysore Sandalwood", 4.6, 188, 250, 0, "3401.11", 240, "Saponified oils, santalum", "Keep dry between uses.", "Mysuru", "Cold process, 4-week cure", "Seed paper wrap"],
    ["IND-UP-RW-025", "Kannauj Rose Water — 250ml", "kannauj-rose-water",
      "Deg-bhapka distilled rosa damascena. The perfume capital of India, in a bottle.",
      "Hydro-distilled in copper deg stills. No synthetic rose. Culinary and ritual grade.",
      320, 11, 450, 4, 26, 2, U("photo-1556228720-195a672e8a03"), 60, 2, 1, "Kannauj Attar / Rose", 4.7, 132, 101, 0, "3301.90", 300, "Rosa damascena hydrosol", "Refrigerate after opening.", "Kannauj", "Deg-bhapka distillation", "Glass"],
    ["IND-RJ-UB-026", "Rajasthan Turmeric Face Ubtan", "rajasthan-turmeric-ubtan",
      "Haldi, gram flour, sandal and rose. Bridal ubtan in a reusable brass tin.",
      "A pre-wedding ritual, reformulated for weekly use. No bleach, no microbeads.",
      450, 12, 620, 4, 21, 5, U("photo-1608571423902-eed4a5ad8108"), 50, 2, 0, "", 4.5, 97, 88, 0, "3304.99", 180, "Botanical powders", "Mix with rose water or milk.", "Jaipur", "Stone ground", "Brass tin"],
    ["IND-HP-HS-027", "Himalayan Bath Salts — 400g", "himalayan-bath-salts",
      "Pink salt, cedar and wild rose from Uttarakhand cooperatives.",
      "Hand-harvested salt blended with hill herbs. Carbon-offset shipping.",
      380, 11, 520, 4, 27, 8, U("photo-1540555700478-4be289fbecef"), 40, 3, 0, "", 4.4, 64, 55, 0, "2501.00", 450, "Halite, botanicals", "External use.", "Chamoli", "Hand blend", "Glass jar"],
    ["IND-MH-KC-028", "Authentic Kolhapuri Chappals", "authentic-kolhapuri-chappals",
      "Hand-cut, hand-stitched vegetable-tanned leather. The original — not the luxury-house copy.",
      "Lakshmi Patil's workshop. GI-tagged Kolhapuri. INDIVA pays 78% of the retail to the maker. This is the craft Prada borrowed.",
      1890, 35, 2490, 5, 14, 4, U("photo-1603808033192-082d166bdab5"), 28, 1, 1, "Kolhapuri Chappal", 4.8, 512, 340, 1, "6403.99", 480, "Buffalo leather, vegetable tan", "Keep dry. Condition with oil.", "Kolhapur", "Cut, stitch, brand, 3 days", "Cotton bag, care card"],
    ["IND-OD-SF-029", "Odisha Silver Filigree Earrings", "odisha-silver-filigree-earrings",
      "Cuttack tarakasi — silver drawn to hair-thin wire, then lacquered into lace.",
      "Sita Murmu finishes each pair. A craft that looks like frost on a window.",
      2800, 40, 3600, 5, 19, 9, "/brand/cat-jewelry.jpg", 22, 1, 1, "Cuttack Silver Filigree", 4.7, 143, 90, 1, "7113.11", 40, "92.5 silver", "Store in anti-tarnish pouch.", "Cuttack", "Wire draw + solder, 4 days", "Velvet box"],
    ["IND-RJ-MK-030", "Jaipur Meenakari Earrings", "jaipur-meenakari-earrings",
      "Enamel on silver, peacock motif. Colour fired, not painted.",
      "The reverse is as beautiful as the front — the test of real meenakari.",
      2450, 38, 3200, 5, 21, 5, U("photo-1515562141207-7a88fb7ce338"), 18, 1, 0, "", 4.6, 121, 77, 0, "7113.11", 35, "Silver, enamel", "Avoid perfume.", "Jaipur", "Champlevé enamel", "Silk pouch"],
    ["IND-TN-TJ-031", "Temple Jewelry Necklace Set", "temple-jewelry-necklace-set",
      "Nagas-style temple set in gold-plated silver with ruby-red stones. Bridal.",
      "Motifs of goddess and peacock, made in the workshops around Mylapore and Kanchi.",
      8900, 95, 11900, 5, 23, 1, U("photo-1617038260897-41a1f14a8ca0"), 8, 1, 0, "", 4.9, 68, 29, 1, "7113.19", 90, "Silver, gold plate, stones", "Wipe after wear.", "Kanchipuram", "Repoussé + set, 12 days", "Wooden jewelry box"],
    ["IND-AS-BB-032", "Assam Bamboo Market Basket", "assam-bamboo-market-basket",
      "Tight-weave bamboo from a women-led cooperative. Market, picnic, or magazine stand.",
      "Split, smoked and woven without nails. A zero-plastic household object.",
      650, 14, 890, 5, 3, 8, U("photo-1595348020949-87cdfbb44174"), 35, 2, 0, "", 4.5, 84, 110, 0, "4602.11", 400, "Bamboo", "Wipe dry.", "Jorhat", "Split and weave, 2 days", "Unpacked, nested"],
    ["IND-WB-JT-033", "Bengal Jute Tote — Natural", "bengal-jute-tote",
      "Heavy golden jute with leather handles. The anti-plastic bag, made well.",
      "Woven in a women SHG near Kolkata. Lasts years, not weeks.",
      890, 16, 1200, 5, 28, 6, U("photo-1595348020949-87cdfbb44174"), 40, 2, 0, "", 4.4, 156, 200, 0, "4202.92", 350, "Jute, leather", "Spot clean.", "Howrah", "Power loom jute + hand finish", "None — it is the bag"],
    ["IND-RJ-MJ-034", "Mojari Leather Juttis", "mojari-leather-juttis",
      "Hand-embroidered mojari from Jaipur. Leather sole, curled toe, silk upper.",
      "The court shoe of Rajasthan, still made on wooden lasts.",
      1650, 28, 2200, 5, 21, 5, U("photo-1603808033192-082d166bdab5"), 26, 2, 0, "", 4.5, 109, 80, 0, "6403.59", 420, "Leather, silk", "Keep dry.", "Jaipur", "Lasted, embroidered", "Cloth bag"],
    ["IND-GJ-AG-035", "Kutch Agate Necklace", "kutch-agate-necklace",
      "Khambhat agate beads, hand-cut and tumbled. Earth reds and creams.",
      "Khambhat has cut agate since the Indus valley. This strand is a quiet luxury.",
      1950, 32, 2600, 5, 7, 10, U("photo-1515562141207-7a88fb7ce338"), 17, 2, 0, "", 4.6, 58, 40, 0, "7116.20", 60, "Agate, cotton cord", "Avoid knocks.", "Khambhat", "Cut, tumble, string", "Cotton pouch"],
    ["IND-KL-HM-036", "Onam Wellness Hamper", "onam-wellness-hamper",
      "Hair oil, sandal soap, pepper, and a brass diya — a Kerala introduction. Gift-ready.",
      "Curated for export and festival gifting. 275% of cost is artisan share across four makers.",
      1890, 40, 2490, 4, 12, 8, "/brand/cat-wellness.jpg", 22, 1, 0, "", 4.8, 77, 65, 1, "2106.90", 900, "Mixed", "See inner cards.", "Idukki + Mysuru", "Assembled at Mumbai hub", "Bamboo hamper, story cards"],
  ];

  for (const p of products) {
    const images = JSON.stringify([p[11], "/brand/store.jpg", "/brand/artisan.jpg"]);
    await db.execute({
      sql: `INSERT INTO products
        (sku,name,slug,description,story,price,export_price,mrp,category_id,state_id,artisan_id,image,images,stock,quality_tier,gi_tagged,gi_name,rating,reviews_count,sold,featured,hs_code,weight_grams,material,care,origin_village,making_process,eco_impact,status)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [...p.slice(0, 12), images, ...p.slice(12), "active"],
    });
  }

  const reviews = [
    [1, 3, 5, "Heirloom worthy", "The zari is real, the drape is heavy in the right way. Came with Meera Devi's story card. My mother cried.", "Arjun Mehta"],
    [1, 4, 5, "Better than the boutique", "Bought after comparing three stores in Chennai. INDIVA's loom-to-door price is honest.", "Priya Sharma"],
    [3, 3, 5, "It did pass through a ring", "I was sceptical. It did. Soft as breath. No itch.", "Arjun Mehta"],
    [28, 4, 5, "Take that, Prada", "Finally a pair that credits Kolhapur. Fit is true, leather smells like a workshop not a factory.", "Priya Sharma"],
    [16, 3, 5, "Muscatel, as promised", "First flush that actually tastes like Darjeeling, not dust. The QR showed the estate.", "Arjun Mehta"],
    [11, 4, 4, "Colours are alive", "Hung in our living room. Guests always ask. Framing was solid.", "Priya Sharma"],
    [9, 3, 5, "Museum piece", "The blue is the Jaipur blue, not a print. Heavy, perfect.", "Arjun Mehta"],
    [4, 4, 5, "This month's Gujarat pick", "The knots are tiny and even. You can tell it was tied by hand.", "Priya Sharma"],
  ];
  for (const r of reviews) {
    await db.execute({
      sql: "INSERT INTO reviews (product_id,user_id,rating,title,body,author) VALUES (?,?,?,?,?,?)",
      args: r,
    });
  }

  await db.execute({
    sql: `INSERT INTO warehouses (name,city,type) VALUES
      ('Mumbai Hub','Navi Mumbai','main'),
      ('Delhi Hub','Gurugram','main'),
      ('Cold Store — Oils & Foods','Navi Mumbai','cold'),
      ('Chennai Satellite','Chennai','satellite'),
      ('Ahmedabad Pop-up','Ahmedabad','satellite')`,
    args: [],
  });

  const prods = await db.execute("SELECT id, stock FROM products");
  for (const row of prods.rows as any[]) {
    await db.execute({
      sql: "INSERT INTO inventory (product_id, warehouse_id, qty) VALUES (?,?,?), (?,?,?), (?,?,?)",
      args: [row.id, 1, Math.ceil(row.stock * 0.6), row.id, 2, Math.ceil(row.stock * 0.3), row.id, 3, Math.floor(row.stock * 0.1)],
    });
  }

  // sample orders
  await db.execute({
    sql: `INSERT INTO orders (order_no,user_id,status,total,shipping,tax,address_json,payment_method,payment_status,is_export,country,tracking)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?,?,?,?,?)`,
    args: [
      "IN24A1B2901", 3, "delivered", 19399, 0, 899, JSON.stringify({ name: "Arjun Mehta", city: "Bengaluru", state: "Karnataka", line1: "12 Lavelle Road", pincode: "560001" }), "UPI", "paid", 0, "India", "INDIVA-MUM-88421",
      "IN24A1B2902", 4, "shipped", 4680, 80, 220, JSON.stringify({ name: "Priya Sharma", city: "Delhi", state: "Delhi", line1: "44 Khan Market", pincode: "110003" }), "Card", "paid", 0, "India", "INDIVA-DEL-11902",
      "IN24A1X4401", 3, "packed", 17500, 1200, 0, JSON.stringify({ name: "Arjun Mehta", city: "London", state: "UK", line1: "11 Brick Lane", pincode: "E1 6PU" }), "Card", "paid", 1, "United Kingdom", "DHL-IN-440912",
    ],
  });
  await db.execute({
    sql: `INSERT INTO order_items (order_id,product_id,name,price,qty,artisan_id,image) VALUES
      (1,1,'Kanjivaram Bridal Silk Saree',18500,1,1,'/brand/cat-fashion.jpg'),
      (2,4,'Bandhani Bridal Odhani',4500,1,10,'/brand/month-gujarat.jpg'),
      (3,2,'Banarasi Kadhua Brocade Saree',175,1,2,'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80')`,
    args: [],
  });

  await db.execute({
    sql: `INSERT INTO sos_alerts (artisan_id,user_id,message,status) VALUES
      (4,2,'Need help with GI document scan for a new Kolhapuri batch.','open'),
      (10,2,'Bandhani dye lot delayed by rain in Bhuj — please pause listing IND-GJ-BD-004 after current stock.','acknowledged')`,
    args: [],
  });

  await db.execute({
    sql: `INSERT INTO savings_tx (artisan_id,amount,note) VALUES
      (1,2400,'Auto-save 8% of week 42 payout'),
      (1,1800,'Auto-save 8% of week 43 payout'),
      (4,900,'Auto-save 8% of week 43 payout')`,
    args: [],
  });
}
