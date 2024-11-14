// ... existing code ...
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// ... existing code ...

const httpsAgent = new (require('https').Agent)({
    rejectUnauthorized: false,
    secureOptions: require('constants').SSL_OP_LEGACY_SERVER_CONNECT
  });

  await fetch(url, { agent: httpsAgent });

async function downloadImage(url, filename) {
  const response = await fetch(url);
  
  if (!response.ok) {
    console.error(`Failed to download ${url}: ${response.statusText}`);
    return;
  }

  const buffer = await response.buffer();
  fs.writeFileSync(filename, buffer);
  console.log(`Downloaded and saved ${filename}`);
}

async function downloadImages(urls) {
  const mediaDir = path.join(__dirname, "media");

  // Ensure media directory exists
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir);
  }

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const ext = path.extname(url) || ".jpg"; // Default to .jpg if no extension
    const filename = path.join(mediaDir, `image${i + 1}${ext}`);

    await downloadImage(url, filename);
  }
}

// Replace this with your actual URLs
const imageUrls = [
    'https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fwp-content%2Fblogs.dir%2F6%2Ffiles%2F2022%2F06%2Fle-sserafim-k-pop-hybe-source-music-interview-tw.jpg?w=960&cbr=1&q=90&fit=max',
  'https://upload.wikimedia.org/wikipedia/commons/1/10/%EB%A5%B4%EC%84%B8%EB%9D%BC%ED%95%8C_-_%EB%AE%A4%EC%A7%81%EB%B1%85%ED%81%AC_%EC%B6%9C%EA%B7%BC%EA%B8%B8_%EC%A7%81%EC%BA%A0_MusicBank_Fancam_220624.jpg',
  'https://static.wikia.nocookie.net/love-talk/images/c/ce/LESSERAFIMGroupTeaser4.jpg/revision/latest/scale-to-width-down/1200?cb=20220925170508',
  'https://www.usatoday.com/gcdn/presto/2023/05/01/USAT/99b22528-f27f-4f71-9f97-3f631cf6701a-LE_SSERAFIM_-_UNFORGIVEN_MEDIA_SHOWCASE__GROUP_2.jpg?width=1200&disable=upscale&format=pjpg&auto=webp',
  'https://images.moneycontrol.com/static-mcnews/2024/08/20240806141531_ko.jpg?impolicy=website&width=770&height=431',
  'https://www.j-14.com/wp-content/uploads/2024/08/le-sserafim.jpg?fit=800%2C828&quality=86&strip=all',
  'https://kbopped.com/wp-content/uploads/2022/05/fearless.jpeg?w=1200',
  'https://kpopping.com/documents/ef/2/4096/LE-SSERAFIM-4th-Mini-Album-CRAZY-Concept-Photos-documents-1.jpeg?v=69b21',
  'https://external-preview.redd.it/230413-le-sserafim-the-1st-studio-album-unforgiven-concept-v0-SjXozqfU1zjot8UB4zvu3MqB1oikzw_s3sLzR2Qop1M.jpg?auto=webp&s=142457647758480d6990bcb0deb31b6026f8eda9',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/220602_%EB%A5%B4%EC%84%B8%EB%9D%BC%ED%95%8C_%EB%8C%80%EB%A9%B4_%ED%8C%AC%EC%82%AC%EC%9D%B8%ED%9A%8C_%EC%B9%B4%EC%A6%88%ED%95%98%2C_%EA%B9%80%EC%B1%84%EC%9B%90%2C_%EC%82%AC%EC%BF%A0%EB%9D%BC%2C_%ED%97%88%EC%9C%A4%EC%A7%84%2C_%ED%99%8D%EC%9D%80%EC%B1%84_%EB%8B%A8%EC%B2%B4_%EC%BB%B7.jpg/800px-220602_%EB%A5%B4%EC%84%B8%EB%9D%BC%ED%95%8C_%EB%8C%80%EB%A9%B4_%ED%8C%AC%EC%82%AC%EC%9D%B8%ED%9A%8C_%EC%B9%B4%EC%A6%88%ED%95%98%2C_%EA%B9%80%EC%B1%84%EC%9B%90%2C_%EC%82%AC%EC%BF%A0%EB%9D%BC%2C_%ED%97%88%EC%9C%A4%EC%A7%84%2C_%ED%99%8D%EC%9D%80%EC%B1%84_%EB%8B%A8%EC%B2%B4_%EC%BB%B7.jpg',
  'https://inthepann.com/wp-content/uploads/2024/09/LE_SSERAFIM_0902.webp',
  'https://images.lifestyleasia.com/wp-content/uploads/sites/2/2024/09/09105015/le-sserafim-crazy-album.jpg',
  'https://www.kpopusaonline.com/wp-content/uploads/2023/03/LE-SSERAFIM-FEARLESS-POSTER-B-1.png',
  'https://idolinsights.com/wp-content/uploads/2024/05/le-sserafim-members.webp',
  'https://www.billboard.com/wp-content/uploads/2023/10/LE-SSERAFIM-cr-Maho-Korogi-bb-japan-2023-billboard-1548.jpg?w=942&h=623&crop=1',
  'https://www.udiscovermusic.com/wp-content/uploads/2023/10/LE-SSERAFIM-GettyImages-1487249643-1-1000x600.jpg',
  'https://cdn.i-scmp.com/sites/default/files/d8/images/canvas/2024/08/01/c01877a9-27b3-4e7c-be6a-0996e82a64f5_8b7f4743.jpg',
  'https://cdn-images.dzcdn.net/images/cover/90f5c3693756ee020ca19a8d8406e256/0x1900-000000-80-0-0.jpg',
  'https://img.koreaboo.com/FP1LX-LXEAAaY90.jpg',
  'https://i.ebayimg.com/images/g/UtgAAOSwbfNlt0FR/s-l1200.jpg',
  'https://img5.yna.co.kr/photo/cms/2022/07/29/78/PCM20220729000078005_P4.jpg',
  'https://uploaded.celebconfirmed.com/0_8e9cf728_4b02_42fc_b8a0_124ca835a3bc_859fea6f1c.jpg',
  'https://shop.le-sserafim.us/cdn/shop/files/Main_Mobile.png?v=1722637590&width=850',
  'https://d.ibtimes.com/en/full/4490399/le-sserafim.jpg?w=1600&h=1600&q=88&f=f33d1e0911e779679cfa81a93f5694a0',
  'https://6.soompi.io/wp-content/uploads/image/20240220161056_LE-SSERAFIM-1.jpg?s=900x600&e=t',
  'https://kpopworld.com/storage/129OKxKI5MdEbKECp60HCcYUVnnytrX1hV4v53um.jpg',
  'https://i.redd.it/jqr7b1cppis81.jpg',
  'https://www.nme.com/wp-content/uploads/2024/08/NME-HERO-LE-SSERAFIM-CREDIT-KRISTEN-JAN-WONG@2560x1625.jpg',
  'https://newsimg.koreatimes.co.kr/2024/08/05/74085410-cdde-43ff-bdf9-a0d066f44182.jpg',
  'https://images.lifestyleasia.com/wp-content/uploads/sites/2/2024/09/09105028/le-sserafim-crazy-showcase.jpg',
  'https://preview.redd.it/breaking-popular-girl-group-le-sserafim-will-be-adding-2-v0-g1thm5bp2ymc1.jpeg?auto=webp&s=9749c20e0ed19d54c0f62e0eca44130cfe4a20e3',
  'https://dbkpop.com/wp-content/uploads/2023/05/le_sserafim_mvs.jpg',
  'https://www.usatoday.com/gcdn/authoring/authoring-images/2024/02/09/USAT/72540180007-le-sserafim-main-press-photo-photo-credit-source-music.jpg?crop=4499,3375,x0,y1000',
  'https://images.squarespace-cdn.com/content/v1/56eb012f27d4bd29de975fae/c8c40995-7ce4-4eea-b879-0345ee4377ec/NR_LESSERAFIM_Header.jpg',
  'https://hello82.com/cdn/shop/files/LE_SSERAFIM_CRAZY_hello82_Exclusive_thumbnail_Blurred.jpg?v=1724033588&width=1920',
  'https://www.rollingstone.com/wp-content/uploads/2024/03/2_LE-SSERAFIM_SM_Photo-Credit-SOURCE-MUSIC.jpg?w=1581&h=1054&crop=1',
  'https://img2.yna.co.kr/etc/inner/EN/2024/02/19/AEN20240219006500315_03_i_P2.jpg',
  'https://nextshark.b-cdn.net/wp-content/uploads/2022/05/le-sserafim.jpg?width=1536&auto_optimize=medium&quality=85',
  'https://images.squarespace-cdn.com/content/v1/56eb012f27d4bd29de975fae/ac1c408f-cdb4-4703-9535-dc3175d4dc15/NR_LE+SSERAFIM_Header.JPG',
  'https://images-prod.dazeddigital.com/958/azure/dazed-prod/1360/8/1368162.jpg',
  'https://i.ytimg.com/vi/aiBvvOWRziY/maxresdefault.jpg',
  'https://6.soompi.io/wp-content/uploads/image/20230613181933_LE-SSERAFIM-1.jpg?s=900x600&e=t',
  'https://koreajoongangdaily.joins.com/data/photo/2022/04/13/cfb51d01-ad2a-43cc-a8f3-c08c3894e8f7.jpg',
  'https://kpopreviewed.com/wp-content/uploads/2024/08/lesserafim-crazy.png?w=1200&h=616&crop=1',
  'https://preview.redd.it/overwatch-and-perfect-night-made-me-into-a-le-sserafim-fan-v0-gaadqnhgb3zc1.jpeg?auto=webp&s=064c9fb674cd8b0f1399c07d5b01f6a100fc1e4b',
  'https://assets.teenvogue.com/photos/634d762e3dddfe8a6cda30af/3:2/w_1214,h_809,c_limit/LE%20SSERAFIM%20ANTIFRAGILE%20MEDIA%20SHOWCASE%20(1).jpg',
  'https://i.ytimg.com/vi/n6B5gQXlB-0/maxresdefault.jpg',
  'https://www.nme.com/wp-content/uploads/2024/08/NME-COVER-LE-SSERAFIM-CREDIT-KRISTEN-JAN-WONG@2160x2700.jpg',
  'https://c.files.bbci.co.uk/5889/live/a19fca70-8c79-11ef-8a4d-3d83d5927fa4.jpg',
  'https://cdn.k-ennews.com/news/photo/202408/3100_8184_4024.jpg',
  'https://i.redd.it/240511-le-sserafim-twitter-update-at-le-sserafim-fan-v0-8fucograsszc1.jpg?width=2000&format=pjpg&auto=webp&s=6b7153ad54dd5af2a012bd2bcbf17b6fe7f6e81b',
  'https://kpopreviewed.com/wp-content/uploads/2024/07/lesserafim-smart.png?w=1200&h=554&crop=1',
  'https://www.udiscovermusic.com/wp-content/uploads/2023/09/LE-SSERAFIM-GettyImages-1487249795.jpg',
  'https://preview.redd.it/230825-whos-your-favorite-le-sserafim-member-and-why-v0-iin4i2ufp6kb1.jpg?width=640&crop=smart&auto=webp&s=87b2893d2eb7be9ef2b883eb1d4ee4166678c68b',
  'https://kpopinfo114.wordpress.com/wp-content/uploads/2022/05/fearless-whos-who.jpg',
  'https://koreajoongangdaily.joins.com/data/photo/2024/06/28/4a864f05-5721-46f2-bd99-99627e6da9bb.jpg',
  'https://i.scdn.co/image/ab67616d00001e02d49db78bd7ea1f7229865baa',
  'http://shop.le-sserafim.us/cdn/shop/files/PerfectNight_thumbnail_10_19_1.jpg?v=1697641203',
  'https://assets.teenvogue.com/photos/65d643e1f89d8628818590d6/1:1/w_1291,h_1291,c_limit/LSF_00.jpg',
  'https://static.toiimg.com/thumb/msid-113185677,imgsize-110754,width-400,resizemode-4/113185677.jpg',
  'https://ih1.redbubble.net/image.4983496908.2744/flat,750x,075,f-pad,750x1000,f8f8f8.jpg',
  'https://i.ytimg.com/vi/UBURTj20HXI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBetTUmFl1omMxRQSmZliDKxE1kew',
  'https://www.pinkvilla.com/english/images/2023/05/618674469_whatsapp-image-2023-05-02-at-17-04-39_1600*900.jpg',
  'https://i1.sndcdn.com/artworks-HruwoSChGJ9Jm2y6-74UAxw-t500x500.jpg',
  'https://dwgyu36up6iuz.cloudfront.net/heru80fdn/image/upload/c_fill,d_placeholder_teenvogue.png,fl_progressive,g_face,h_1080,q_80,w_1920/v1727186194/teenvogue_le-sserafim-answer-questions-about-each-other.jpg',
  'https://static1.straitstimes.com.sg/s3fs-public/styles/large30x20/public/articles/2024/09/02/hzs090224.jpg?VersionId=k.doYB3QEm1RVJtn9z3JdgurLWIhmvbM',
  'https://i0.wp.com/www.poptokki.com/wp-content/uploads/2024/08/LE-SSERAFIM-CONCEPT.png?fit=1200%2C628&ssl=1',
  'https://www.rappler.com/tachyon/2022/09/Le-Sserafim-Twitter.jpeg',
  'https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=274969468542219',
  'https://www.asianjunkie.com/wp-content/uploads/2024/08/LESSERAFIMCRAZY.jpg',
  'https://preview.redd.it/230706-le-sserafim-has-surpassed-2-000-000-members-on-their-v0-5yegutqg5eab1.png?width=1080&crop=smart&auto=webp&s=d558256754dec75cdb0409ea525124d1bc004eeb',
  'http://kplaceshop.com/cdn/shop/files/le-sserafim-easy-3rd-mini-album-main-image_600x.jpg?v=1707420634',
  'https://i.ytimg.com/vi/pyf8cbqyfPs/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAfhQO4ATBfQEnWe4OphIhxz5MTOg',
  'https://static.wikia.nocookie.net/le-sserafim/images/7/72/LE_SSERAFIM_Company_Poster.jpg/revision/latest?cb=20230126080312',
  'https://i5.walmartimages.com/seo/LE-SSERAFIM-1st-Studio-Album-UNFORGIVEN-BLOODY-ROSE-Walmart-Exclusive-KPop-CD_dc265b06-f76a-4bbf-98a6-d127a29d2c54.4b947b944f8daec1cd2bb9aaecfb3af2.png',
  'https://upload.wikimedia.org/wikipedia/commons/5/53/LE_SSERAFIM_logo.svg',
  'https://images.squarespace-cdn.com/content/v1/56eb012f27d4bd29de975fae/906be6ec-8a3e-41c6-bc26-c758b629ccae/NR_LESSRAFIM_HEADER.jpg',
  'https://media.allure.com/photos/6371612452f9aa84c5c7b37a/master/w_1600%2Cc_limit/le%2520sserafim%2520sparkly%2520group%2520photo.jpg',
  'https://cdnph.upi.com/ph/st/th/2841708364032/2024/upi/ddc139cd33fe591013914e324cd61017/v1.2/Le-Sserafim-returns-with-Easy-EP-music-video.jpg?lg=5&=1',
  'https://media.allure.com/photos/636539c37a5b9d68f388697d/3:2/w_3000,h_2000,c_limit/LE%20SSERAFIM%20interview%20lede.jpg',
  'https://i.ytimg.com/vi/bNKXxwOQYB8/hqdefault.jpg?v=65d1d6b5',
  'https://cdn.vietnam.vn/wp-content/uploads/2024/03/LE-SSERAFIM-bi-che-hat-live-kem-du-thang-toan.jpg',
  'http://shop.le-sserafim.us/cdn/shop/files/Standard_Vol1_THUNDERINGCEDAR_Thumbnail_1_f8e10e3a-74c6-4c9e-b9db-9dd4219a3f7b.jpg?v=1724083285',
  'https://images.genius.com/935df7e5d6ffdc8c154fee5e2554829d.999x999x1.jpg',
  'https://e.snmc.io/i/600/s/d286e51d1c94cf0245811b6fc460d08b/11820536/le-sserafim-easy-Cover-Art.jpg',
  'https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=100080875023851',
  'https://res.heraldm.com/phpwas/restmb_idxmake_amp.php?idx=680&simg=%2Fcontent%2Fimage%2F2022%2F05%2F02%2F20220502000850_0.jpg',
  'https://hello82.com/cdn/shop/files/Compact_Thumbnail.jpg?v=1724033211&width=1920',
  'http://kpopmerch.com/cdn/shop/products/le-sserafim-album-le-sserafim-unforgiven-1st-studio-album-35306402906293.jpg?v=1681724481',
  'https://www.allkpop.com/upload/2024/09/content/071307/web_data/allkpop_1725731619_le-sserafim-the-4th-mini-album-crazy-mv-photo-sketch-v0-ufv1k3tm7dnd1.jpg',
  'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bcc96d39-785d-4796-bb89-fede2ff7fe12/df55z7l-15e967ee-664b-4ebe-b23b-386c10a3b7e0.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2JjYzk2ZDM5LTc4NWQtNDc5Ni1iYjg5LWZlZGUyZmY3ZmUxMlwvZGY1NXo3bC0xNWU5NjdlZS02NjRiLTRlYmUtYjIzYi0zODZjMTBhM2I3ZTAuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.rHyVzm3iGhz-KgSn54TAVPluzksIWsS-eN-om8ybCb4',
  'http://nolae.eu/cdn/shop/products/le-sserafim-antifragile-2nd-mini-album-nolae-742489.jpg?v=1694005955&width=1024',
  'http://kplaceshop.com/cdn/shop/files/le-sserafim-easy-3rd-mini-album-compact-version-main-image_600x.jpg?v=1707420374',
  'https://www.billboard.com/wp-content/uploads/2024/08/LE-SSERAFIM-LE-SSERAFIM-music-video-bts-exclusives-billboard-1240.jpg?w=875&h=583&crop=1',
  'https://cdn.k-ennews.com/news/photo/202409/3524_9389_047.jpg',
  'https://kpopreviewed.com/wp-content/uploads/2024/07/lesserafim-easy-1.jpeg?w=1200&h=800&crop=1'
];

downloadImages(imageUrls);