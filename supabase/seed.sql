-- ThailandGPT v2 — seed data (mock only, no real PII)
-- Run AFTER 0001_init.sql

-- ============================================================
-- SUPPLIERS — 20 fictional Thai suppliers
-- ============================================================
insert into suppliers (id, name, name_th, category, region, description, description_th, tier, patrick_circle, verified, verified_at, performance_score, review_count, review_avg, past_deals_count, past_gmv_usd, certifications, tags, hero_image_prompt) values
('sup-001','Khun Wichai Durian Estate','สวนคุณวิชัย จันทบุรี','agriculture','Chanthaburi','Premium Monthong durian, 3rd-generation orchard.','สวนทุเรียนหมอนทองพรีเมียม รุ่นที่ 3','Elite',true,true,now() - interval '180 days',96,42,4.9,18,540000,array['GAP-Plus','EU-Organic'],array['durian','monthong','export-grade'],'misty mountain durian orchard at golden hour'),
('sup-002','Siam Premium Rice Cooperative','สหกรณ์ข้าวสยามพรีเมียม','agriculture','Surin','Jasmine + heritage rice from 240 farms.','ข้าวหอมมะลิและข้าวพื้นเมือง 240 ฟาร์ม','Elite',true,true,now() - interval '210 days',94,67,4.8,31,720000,array['GI-Surin','Fair-Trade','USDA-Organic'],array['rice','jasmine','heritage'],'green rice paddies under wide sky'),
('sup-003','Chiang Rai Tea Atelier','โรงชาเชียงรายอาเทเลีย','beverage','Chiang Rai','Single-origin oolong + assam, hand-picked.','ชาอู่หลงและอัสสัมต้นเดี่ยว เก็บมือ','Pro',false,true,now() - interval '120 days',88,28,4.7,9,180000,array['Rainforest-Alliance'],array['tea','oolong','single-origin'],'terraced tea plantation in early mist'),
('sup-004','Phuket Andaman Sea Salt','เกลือทะเลอันดามันภูเก็ต','seafood','Phuket','Hand-harvested flake salt, mineral-rich.','เกลือเกล็ดเก็บมือ แร่ธาตุครบ','Trusted',false,true,now() - interval '90 days',82,15,4.5,6,72000,array['HACCP'],array['salt','flake','gourmet'],'salt flats reflecting sunset over Andaman'),
('sup-005','Lanna Silk Atelier','ผ้าไหมล้านนาอาเทเลีย','textile','Chiang Mai','Hand-loomed mulberry silk, natural dyes.','ผ้าไหมหม่อนทอมือ ย้อมสีธรรมชาติ','Elite',true,true,now() - interval '300 days',93,54,4.9,22,440000,array['Royal-Project','SACICT'],array['silk','handloom','natural-dye'],'wooden loom with golden silk threads'),
('sup-006','Ratchaburi Coconut Estates','ไร่มะพร้าวราชบุรี','agriculture','Ratchaburi','Aromatic coconut + virgin coconut oil.','มะพร้าวน้ำหอมและน้ำมันมะพร้าวบริสุทธิ์','Pro',false,true,now() - interval '150 days',85,33,4.6,12,216000,array['Organic-Thailand'],array['coconut','vco','aromatic'],'rows of young coconut palms'),
('sup-007','Nan Highland Coffee Roasters','โรงคั่วกาแฟน่านไฮแลนด์','beverage','Nan','Specialty arabica from 1,200m elevation.','กาแฟอราบิก้าพิเศษจาก 1,200 เมตร','Pro',false,true,now() - interval '100 days',86,22,4.7,8,128000,array['SCA-Specialty'],array['coffee','arabica','single-estate'],'coffee cherries on slope'),
('sup-008','Trang Tiger Prawn Hatchery','โรงเพาะกุ้งกุลาดำตรัง','seafood','Trang','Sustainable black tiger prawns, BAP-certified.','กุ้งกุลาดำยั่งยืน รับรอง BAP','Pro',false,true,now() - interval '80 days',81,19,4.4,11,330000,array['BAP','ASC'],array['prawn','black-tiger','sustainable'],'prawn pond at dawn with mist'),
('sup-009','Sukhothai Celadon Atelier','เครื่องสังคโลกสุโขทัย','craft','Sukhothai','Traditional celadon ware, master kiln.','เครื่องสังคโลกประเพณี เตามือชั้นครู','Elite',true,true,now() - interval '400 days',91,47,4.8,17,255000,array['SACICT','Royal-Project'],array['celadon','ceramic','heritage'],'celadon vase on dark wood altar'),
('sup-010','Lampang Ceramic Works','โรงเครื่องปั้นลำปาง','craft','Lampang','Tableware for hospitality, food-safe glaze.','เครื่องปั้นโต๊ะอาหาร เคลือบปลอดภัย','Trusted',false,true,now() - interval '60 days',78,11,4.3,5,75000,array['LFGB','FDA'],array['ceramic','tableware','b2b'],'rows of glazed dinnerware'),
('sup-011','Phrae Teak Furniture Studio','สตูดิโอเฟอร์นิเจอร์สักแพร่','craft','Phrae','Reclaimed teak, FSC-tracked.','ไม้สักรียูส รับรอง FSC','Pro',false,true,now() - interval '170 days',84,16,4.5,7,154000,array['FSC-Recycled'],array['teak','furniture','reclaimed'],'teak workbench with hand tools'),
('sup-012','Nakhon Si Latex Cooperative','สหกรณ์ยางพาราคอนเอ๋อ','manufacturing','Nakhon Si Thammarat','Natural rubber latex, food-grade pillows.','น้ำยางธรรมชาติ หมอนเกรดอาหาร','Pro',false,true,now() - interval '110 days',83,24,4.5,9,189000,array['LGA','ECO-Institute'],array['latex','rubber','pillow'],'latex sap dripping from rubber tree'),
('sup-013','Chiang Mai Wellness Botanicals','สมุนไพรเชียงใหม่เวลเนส','wellness','Chiang Mai','Cold-pressed botanical oils + extracts.','น้ำมันสมุนไพรสกัดเย็นและเอ็กซ์แทรค','Pro',false,true,now() - interval '95 days',87,29,4.7,10,167000,array['ECOCERT','COSMOS'],array['botanical','wellness','spa'],'glass dropper with herbal oil'),
('sup-014','Mae Hong Son Hemp Atelier','อาเทเลียกัญชงแม่ฮ่องสอน','textile','Mae Hong Son','Hill-tribe hemp textile, slow-fashion.','ผ้ากัญชงชาวเขา สโลว์แฟชั่น','Trusted',false,true,now() - interval '70 days',80,13,4.6,4,52000,array['Hill-Tribe-Certified'],array['hemp','slow-fashion','heritage'],'hemp loom in mountain village'),
('sup-015','Nakhon Pathom Orchid Exporters','ผู้ส่งออกกล้วยไม้นครปฐม','agriculture','Nakhon Pathom','Cut Dendrobium + Mokara, Asia + EU.','กล้วยไม้ตัดดอก เดนโดรเบียมและโมการ่า','Elite',true,true,now() - interval '250 days',92,38,4.8,19,475000,array['GlobalGAP','MPS-A'],array['orchid','floral','export'],'pink dendrobium orchids in greenhouse'),
('sup-016','Krabi Tropical Fruit Pack','โรงแพ็คผลไม้กระบี่','agriculture','Krabi','Mango, mangosteen, longan — air freight.','มะม่วง มังคุด ลำไย ส่งทางอากาศ','Pro',false,true,now() - interval '105 days',86,26,4.6,13,234000,array['GMP','HACCP'],array['fruit','air-freight','tropical'],'crates of golden mango'),
('sup-017','Yasothon Indigo Cotton Studio','สตูดิโอผ้าครามยโสธร','textile','Yasothon','Natural indigo cotton, master dyers.','ผ้าฝ้ายย้อมครามธรรมชาติ ช่างย้อมระดับครู','Pro',false,true,now() - interval '155 days',89,31,4.8,11,143000,array['SACICT','Slow-Fashion'],array['indigo','cotton','natural-dye'],'indigo vat with cotton fabric'),
('sup-018','Hua Hin Craft Brewery','คราฟต์เบียร์หัวหิน','beverage','Prachuap Khiri Khan','Tropical-fruit craft beer, micro-batch.','คราฟต์เบียร์ผลไม้เขตร้อน รุ่นเล็ก','Trusted',false,false,null,72,8,4.2,3,42000,array['HACCP'],array['beer','craft','tropical'],'amber beer glass in bar light'),
('sup-019','Surat Honey Apiary','รังผึ้งสุราษฎร์','agriculture','Surat Thani','Longan-blossom raw honey, single-source.','น้ำผึ้งดอกลำไยดิบ ต้นเดียว','Pro',false,true,now() - interval '85 days',84,17,4.6,6,72000,array['Organic-Thailand'],array['honey','raw','single-blossom'],'honeycomb dripping golden honey'),
('sup-020','Ayutthaya Silver Atelier','เครื่องเงินอยุธยาอาเทเลีย','craft','Ayutthaya','Hand-chased silverware, royal motifs.','เครื่องเงินเขี่ยมือ ลายราชสำนัก','Elite',true,true,now() - interval '320 days',95,44,4.9,15,375000,array['Royal-Project','SACICT'],array['silver','heritage','royal'],'silver bowl with intricate engraving');

-- ============================================================
-- BUYERS — 20 fictional global buyers
-- ============================================================
insert into buyers (id, name, country, country_code, industry, size, contact_role, description, verified, verified_at, performance_score, review_count, review_avg, past_deals_count, past_spend_usd, preferred_categories, budget_usd_typical_min, budget_usd_typical_max) values
('buy-001','Aspen Organic Markets','United States','US','Organic Retail','Mid-Market','Head of Sourcing','15-store premium organic chain in Mountain West.',true,now() - interval '200 days',92,8,4.8,7,420000,array['agriculture','wellness']::supplier_category_t[],20000,80000),
('buy-002','Blackwood & Sons London','United Kingdom','GB','Luxury Hospitality','Enterprise','Procurement Director','Boutique hotel group, 12 properties UK + EU.',true,now() - interval '180 days',95,12,4.9,9,680000,array['textile','craft','beverage']::supplier_category_t[],30000,150000),
('buy-003','Berlin Bio-Grocer GmbH','Germany','DE','Organic Wholesale','Mid-Market','Category Manager','EU-wide organic distribution, 600 SKUs.',true,now() - interval '150 days',88,6,4.6,5,275000,array['agriculture','beverage','wellness']::supplier_category_t[],15000,60000),
('buy-004','Maison Mireille Paris','France','FR','Luxury Perfumery','SME','Founder','Niche perfume house, exotic botanicals.',true,now() - interval '90 days',90,4,4.8,3,98000,array['wellness','agriculture']::supplier_category_t[],8000,35000),
('buy-005','Tokyo Premium Foods Co.','Japan','JP','Premium Grocery','Enterprise','Buying Manager','Department-store food halls, 22 locations.',true,now() - interval '220 days',94,11,4.9,8,540000,array['agriculture','seafood','beverage']::supplier_category_t[],25000,120000),
('buy-006','Singapore Hospitality Collective','Singapore','SG','Hotel Group','Enterprise','Sourcing Lead','5-star hotels + restaurants, 8 properties.',true,now() - interval '170 days',91,9,4.7,6,395000,array['textile','craft','seafood','beverage']::supplier_category_t[],20000,90000),
('buy-007','Shanghai Lifestyle Trading','China','CN','Lifestyle Retail','Mid-Market','VP Sourcing','Online + offline, premium home + wellness.',true,now() - interval '130 days',86,7,4.5,5,260000,array['craft','textile','wellness']::supplier_category_t[],15000,70000),
('buy-008','Sydney Eco Imports','Australia','AU','Eco Retail','SME','Owner','Boutique retailer, sustainability-focused.',true,now() - interval '110 days',83,5,4.6,4,140000,array['textile','craft','wellness']::supplier_category_t[],8000,30000),
('buy-009','Seoul Beauty Innovations','South Korea','KR','Cosmetics R&D','Mid-Market','Ingredient Sourcing','K-beauty raw material specialist.',true,now() - interval '95 days',89,6,4.7,5,195000,array['wellness','agriculture']::supplier_category_t[],12000,55000),
('buy-010','Riyadh Mall Group','Saudi Arabia','SA','Retail Conglomerate','Enterprise','Procurement Director','Department stores + premium food courts.',false,null,75,2,4.3,1,80000,array['craft','textile','beverage']::supplier_category_t[],30000,100000),
('buy-011','Amsterdam Floral Trading','Netherlands','NL','Floral Auction','Enterprise','Master Buyer','Aalsmeer auction floor importer.',true,now() - interval '300 days',96,18,4.9,14,1120000,array['agriculture']::supplier_category_t[],40000,180000),
('buy-012','Milan Slow Fashion House','Italy','IT','Sustainable Fashion','SME','Creative Director','Atelier brand, capsule collections.',true,now() - interval '140 days',88,5,4.8,4,112000,array['textile','craft']::supplier_category_t[],10000,40000),
('buy-013','Vancouver Wellness Co-op','Canada','CA','Wellness Retail','SME','Buyer','15-store wellness co-op, BC + Alberta.',true,now() - interval '85 days',81,4,4.5,3,72000,array['wellness','beverage']::supplier_category_t[],6000,25000),
('buy-014','Dubai Gourmet Imports','UAE','AE','Gourmet Distribution','Mid-Market','Procurement Lead','Restaurant supply + retail private label.',true,now() - interval '155 days',87,8,4.6,6,310000,array['agriculture','seafood','beverage']::supplier_category_t[],18000,75000),
('buy-015','Helsinki Design Living','Finland','FI','Home Goods','SME','Buyer','Nordic home + tableware boutique.',false,null,76,3,4.4,2,55000,array['craft','textile']::supplier_category_t[],8000,30000),
('buy-016','Sao Paulo Premium Foods','Brazil','BR','Specialty Food','Mid-Market','Buyer','Premium grocery + restaurant supply.',true,now() - interval '70 days',79,3,4.5,2,68000,array['agriculture','beverage']::supplier_category_t[],10000,45000),
('buy-017','New York Tea Importers','United States','US','Specialty Tea','SME','Founder','Direct-trade specialty tea importer.',true,now() - interval '120 days',90,7,4.8,6,168000,array['beverage']::supplier_category_t[],8000,35000),
('buy-018','Hong Kong Fine Goods','Hong Kong','HK','Luxury Retail','Mid-Market','Sourcing Director','Cross-border luxury + heritage retail.',true,now() - interval '180 days',93,10,4.8,8,520000,array['craft','silk','textile']::supplier_category_t[],20000,90000),
('buy-019','Stockholm Conscious Trade','Sweden','SE','Ethical Fashion','SME','Founder','Slow-fashion online retailer.',true,now() - interval '100 days',85,5,4.6,4,98000,array['textile','craft']::supplier_category_t[],8000,32000),
('buy-020','Mexico City Casa Mercado','Mexico','MX','Premium Grocery','Mid-Market','Category Manager','Premium grocery chain, CDMX + Monterrey.',false,null,73,2,4.2,1,42000,array['agriculture','beverage']::supplier_category_t[],10000,40000);

-- ============================================================
-- DEMANDS — open buyer requests
-- ============================================================
insert into demands (id, buyer_id, title, category, quantity_text, budget_usd_min, budget_usd_max, needed_by, description, status) values
('dem-001','buy-001','Premium jasmine rice — 5 tonnes','agriculture','5,000 kg',18000,28000,current_date + 60,'Q3 stocking for premium organic shelves.','open'),
('dem-002','buy-002','Hand-loomed silk for hotel suites','textile','120 m²',45000,80000,current_date + 90,'Bespoke wall + cushion textile, royal motifs.','open'),
('dem-003','buy-003','Single-origin oolong — 200kg','beverage','200 kg',12000,22000,current_date + 45,'Premium tea bar private label.','open'),
('dem-004','buy-005','Aromatic young coconut','agriculture','30,000 units',24000,40000,current_date + 30,'Air-freight to Tokyo food halls.','open'),
('dem-005','buy-006','Celadon ware for hotel restaurants','craft','400 pieces',22000,38000,current_date + 75,'New restaurant fit-out, food-safe glaze.','open'),
('dem-006','buy-009','Botanical extracts for K-beauty','wellness','assorted',18000,55000,current_date + 60,'New skincare line — exotic botanicals.','open'),
('dem-007','buy-011','Cut Dendrobium orchids — weekly','agriculture','3,000 stems/wk',60000,120000,current_date + 14,'Recurring auction-floor supply.','open'),
('dem-008','buy-018','Heritage silver tableware','craft','60 pieces',35000,75000,current_date + 120,'Capsule for luxury department store.','open');

-- ============================================================
-- DEALS — full lifecycle samples (every status)
-- ============================================================
insert into deals (id, supplier_id, buyer_id, demand_id, status, amount_usd, commission_rate, notes, opened_at, agreed_at, paid_at, closed_at, cancelled_at) values
-- closed (paid) deals — for commission report
('deal-001','sup-001','buy-005',null,'closed',86000,0.035,'Monthong durian Q1 shipment — paid in full',now() - interval '85 days', now() - interval '70 days', now() - interval '50 days', now() - interval '40 days', null),
('deal-002','sup-002','buy-001',null,'closed',54000,0.040,'Jasmine rice 12 tonnes — Aspen organic',now() - interval '120 days', now() - interval '110 days', now() - interval '90 days', now() - interval '80 days', null),
('deal-003','sup-005','buy-002',null,'closed',128000,0.030,'Silk panels for Blackwood hotel suites',now() - interval '160 days', now() - interval '140 days', now() - interval '120 days', now() - interval '100 days', null),
('deal-004','sup-009','buy-018',null,'closed',92000,0.035,'Sukhothai celadon — luxury HK retail',now() - interval '95 days', now() - interval '80 days', now() - interval '60 days', now() - interval '45 days', null),
('deal-005','sup-015','buy-011',null,'closed',215000,0.030,'Orchid recurring contract Q1',now() - interval '180 days', now() - interval '170 days', now() - interval '150 days', now() - interval '130 days', null),
('deal-006','sup-020','buy-018',null,'closed',64000,0.035,'Silver tableware capsule batch 1',now() - interval '70 days', now() - interval '55 days', now() - interval '38 days', now() - interval '25 days', null),
('deal-007','sup-003','buy-017',null,'closed',24000,0.040,'Single-origin oolong NY importer',now() - interval '60 days', now() - interval '50 days', now() - interval '35 days', now() - interval '20 days', null),

-- paid (awaiting close)
('deal-008','sup-006','buy-013',null,'paid',18000,0.045,'VCO sample order — Vancouver wellness',now() - interval '40 days', now() - interval '30 days', now() - interval '15 days', null, null),

-- agreed (awaiting payment)
('deal-009','sup-013','buy-009','dem-006','agreed',42000,0.040,'Botanical extracts — K-beauty R&D',now() - interval '20 days', now() - interval '8 days', null, null, null),

-- verifying
('deal-010','sup-008','buy-014',null,'verifying',88000,0.040,'Black tiger prawn sample for Dubai',now() - interval '15 days', null, null, null, null),

-- negotiating (active deals)
('deal-011','sup-002','buy-005','dem-001','negotiating',24000,0.040,'Premium jasmine rice — Aspen Q3',now() - interval '6 days', null, null, null, null),
('deal-012','sup-005','buy-018','dem-002','negotiating',62000,0.035,'Silk for hotel — pricing round 2',now() - interval '4 days', null, null, null, null),
('deal-013','sup-003','buy-003','dem-003','negotiating',16000,0.040,'Berlin bio-grocer oolong line',now() - interval '8 days', null, null, null, null),
('deal-014','sup-015','buy-011','dem-007','negotiating',75000,0.030,'Orchid recurring — Q3 expansion',now() - interval '3 days', null, null, null, null),

-- opened (just started)
('deal-015','sup-007','buy-017',null,'opened',12000,0.045,'Nan coffee sample request',now() - interval '2 days', null, null, null, null),
('deal-016','sup-017','buy-019',null,'opened',18000,0.045,'Indigo cotton — Stockholm capsule',now() - interval '1 days', null, null, null, null),
('deal-017','sup-013','buy-004',null,'opened',9500,0.045,'Botanical oils — Maison Mireille',now() - interval '12 hours', null, null, null, null),

-- cancelled
('deal-018','sup-018','buy-016',null,'cancelled',6000,0.050,'Craft beer — buyer changed direction',now() - interval '30 days', null, null, null, now() - interval '22 days'),

-- disputed
('deal-019','sup-014','buy-012',null,'disputed',22000,0.045,'Hemp shipment — quality dispute under review',now() - interval '50 days', now() - interval '40 days', null, null, null);

-- ============================================================
-- DEAL EVENTS — sample timeline messages
-- ============================================================
insert into deal_events (deal_id, event_type, actor, message, occurred_at) values
('deal-011','opened','platform','Match created via AI search', now() - interval '6 days'),
('deal-011','message','buyer','Interested in 5 tonnes for Q3 organic line. Can you confirm GAP-Plus + EU-Organic?', now() - interval '6 days' + interval '2 hours'),
('deal-011','message','supplier','ยืนยันครับ. 5 tonnes พร้อมส่งภายใน 60 วัน. Lab cert จะส่งให้ภายใน 24 ชม.', now() - interval '5 days'),
('deal-011','message','platform','Patrick has reviewed this match — supplier is Patrick''s Circle (verified personally)', now() - interval '5 days' + interval '1 hour'),
('deal-011','offer','buyer','Offer: $24,000 CFR Long Beach', now() - interval '4 days'),
('deal-011','counter','supplier','Counter: $26,500 CFR Long Beach (premium grade)', now() - interval '3 days'),
('deal-011','message','buyer','Reviewing internally — will respond within 48h', now() - interval '1 days'),

('deal-012','opened','platform','Match created — silk for Blackwood hotel suites', now() - interval '4 days'),
('deal-012','message','buyer','Need 120 m² hand-loomed mulberry silk, royal motif. Budget $45-80K.', now() - interval '4 days' + interval '1 hour'),
('deal-012','message','supplier','Available. ส่งตัวอย่าง 3 ลายให้พิจารณาภายในสัปดาห์นี้', now() - interval '3 days'),
('deal-012','offer','supplier','Quote: $62,000 FOB Bangkok — production 12 weeks', now() - interval '1 days'),

('deal-009','opened','platform','Demand matched: dem-006', now() - interval '20 days'),
('deal-009','message','buyer','We need 5 botanical extracts for new K-beauty line. Samples first.', now() - interval '20 days' + interval '3 hours'),
('deal-009','message','supplier','ส่งตัวอย่าง 5 SKUs พร้อม COA ภายใน 7 วัน', now() - interval '18 days'),
('deal-009','offer','supplier','Full order quote: $42,000 (5 SKUs × 200kg each)', now() - interval '12 days'),
('deal-009','agreed','buyer','Accepted. Proceeding to payment.', now() - interval '8 days'),

('deal-001','opened','platform','Match created via Patrick referral', now() - interval '85 days'),
('deal-001','agreed','buyer','Accepted Q1 shipment terms', now() - interval '70 days'),
('deal-001','paid','platform','Escrow received: $86,000', now() - interval '50 days'),
('deal-001','closed','platform','Shipment delivered + signed off. Commission $3,010 booked.', now() - interval '40 days');
