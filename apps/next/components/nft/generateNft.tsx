import { Cast } from "@/lib/types";

interface CardConfig {
  width: number;
  height: number;
  padding: number;
  borderRadius: number;
  maxImageHeight: number;
}

const escapeText = (text: string) => {
  return text.replace(/[<>&'"]/g, (char) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[char] || char;
  });
};

const generateCastCard = (
  cast: Cast,
  config: CardConfig = {
    width: 600,
    height: 400,
    padding: 40,
    borderRadius: 24,
    maxImageHeight: 200,
  }
) => {
  // Calculate dynamic height based on content
  let contentHeight = config.padding * 2;
  const hasImage = cast.embeds?.some((embed) => embed.metadata?.image);
  const hasQuotedCast = cast.embeds?.some((embed) => embed.cast);

  // Add height for text
  contentHeight += 80; // Basic text height
  if (hasImage) contentHeight += config.maxImageHeight;
  if (hasQuotedCast) contentHeight += 150; // Space for quoted cast

  const actualHeight = Math.max(config.height, contentHeight);

  const svg = `
    <svg width="${config.width}" height="${actualHeight}" viewBox="0 0 ${
    config.width
  } ${actualHeight}" 
         xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <!-- Background gradient -->
        <linearGradient id="paint0_linear_0_3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1E1E1E"/>
          <stop offset="100%" style="stop-color:#2D1A3D"/>
        </linearGradient>
        
        <!-- Border gradient -->
        <linearGradient id="paint1_linear_0_3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#C146F6"/>
          <stop offset="100%" style="stop-color:#7928CA"/>
        </linearGradient>

        <filter id="filter0_b_0_3" x="-4" y="-4" width="100%" height="100%" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="2"/>
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_0_3"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_0_3" result="shape"/>
        </filter>
      </defs>

      <!-- Background with gradient -->
      <rect width="100%" height="100%" fill="url(#paint0_linear_0_3)" filter="url(#filter0_b_0_3)"/>
      
      <!-- Border -->
      <rect x="17" y="17" 
            width="${config.width - 34}" height="${actualHeight - 34}" 
            rx="11" stroke="url(#paint1_linear_0_3)" stroke-width="2" fill="none"/>

      <!-- Header text -->
      <text x="${config.padding}" y="${config.padding + 30}" 
            fill="#C146F6" font-size="28" font-family="Arial, sans-serif">
        I heard a rumour...
      </text>

      <!-- Main content -->
      <g transform="translate(${config.padding}, ${config.padding + 80})">
        <text fill="white" font-size="36" font-family="Arial, sans-serif" font-weight="bold">
          ${escapeText(cast.text || "")}
        </text>
      </g>

      <!-- Footer -->
      <g transform="translate(${config.padding}, ${
    actualHeight - config.padding - 20
  })">
        <!-- Logo -->
        <g transform="translate(0, -10)">
          <svg width="155" height="41" viewBox="0 0 155 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_83_3039)">
            <rect x="0.84375" width="40" height="40" rx="4" fill="url(#paint0_linear_83_3039)"/>
            <g filter="url(#filter0_d_83_3039)">
            <path d="M22.2766 25.0108C22.2766 19.6842 18.9852 15.3661 14.9249 15.3661C10.8647 15.3661 7.57324 19.6842 7.57324 25.0108C7.57324 30.3374 10.8647 34.6555 14.9249 34.6555C18.9852 34.6555 22.2766 30.3374 22.2766 25.0108Z" fill="#FFFBFB"/>
            </g>
            <g filter="url(#filter1_d_83_3039)">
            <path d="M38.0442 25.0108C38.0442 19.6842 34.7527 15.3661 30.6925 15.3661C26.6323 15.3661 23.3408 19.6842 23.3408 25.0108C23.3408 30.3374 26.6323 34.6555 30.6925 34.6555C34.7527 34.6555 38.0442 30.3374 38.0442 25.0108Z" fill="#FFFBFB"/>
            </g>
            <g filter="url(#filter2_d_83_3039)">
            <path d="M30.6701 25.0109C30.6701 23.1741 29.1811 21.6851 27.3443 21.6851C25.5075 21.6851 24.0186 23.1741 24.0186 25.0109C24.0186 26.8477 25.5075 28.3367 27.3443 28.3367C29.1811 28.3367 30.6701 26.8477 30.6701 25.0109Z" fill="#17101F"/>
            </g>
            <g filter="url(#filter3_d_83_3039)">
            <path d="M14.925 25.0109C14.925 23.1741 13.436 21.6851 11.5992 21.6851C9.76243 21.6851 8.27344 23.1741 8.27344 25.0109C8.27344 26.8477 9.76243 28.3367 11.5992 28.3367C13.436 28.3367 14.925 26.8477 14.925 25.0109Z" fill="#3A66E8"/>
            </g>
            </g>
            <path d="M109.517 23.9139V27.6654H99.4189V23.9139H109.517ZM101.534 20.0791H106.63V34.8869C106.63 35.1996 106.679 35.4531 106.776 35.6477C106.88 35.8352 107.03 35.9707 107.224 36.0541C107.419 36.1305 107.651 36.1687 107.922 36.1687C108.117 36.1687 108.322 36.1513 108.537 36.1166C108.759 36.0749 108.926 36.0402 109.037 36.0124L109.808 39.6909C109.565 39.7604 109.221 39.8472 108.777 39.9514C108.339 40.0556 107.815 40.1216 107.203 40.1494C106.008 40.205 104.984 40.0661 104.129 39.7326C103.282 39.3922 102.632 38.8642 102.18 38.1486C101.736 37.4331 101.52 36.5334 101.534 35.4497V20.0791Z" fill="#C848FF"/>
            <path d="M97.5783 28.8013L92.8994 28.9263C92.8508 28.5929 92.7188 28.2976 92.5034 28.0406C92.2881 27.7766 92.0067 27.5717 91.6593 27.4258C91.3189 27.2729 90.9229 27.1965 90.4714 27.1965C89.8809 27.1965 89.3772 27.3146 88.9604 27.5508C88.5505 27.787 88.349 28.1066 88.356 28.5095C88.349 28.8221 88.4741 29.0931 88.7311 29.3223C88.9951 29.5516 89.464 29.7357 90.1379 29.8746L93.2224 30.4582C94.8203 30.7639 96.0083 31.271 96.7863 31.9796C97.5714 32.6882 97.9673 33.6261 97.9743 34.7932C97.9673 35.8909 97.6408 36.8461 96.9947 37.6589C96.3556 38.4717 95.4803 39.1039 94.3687 39.5555C93.2572 40.0001 91.9859 40.2224 90.5547 40.2224C88.2691 40.2224 86.4663 39.7535 85.1464 38.8156C83.8334 37.8708 83.0831 36.6064 82.8955 35.0225L87.9287 34.8974C88.0399 35.481 88.3282 35.9256 88.7936 36.2313C89.2591 36.537 89.8531 36.6898 90.5756 36.6898C91.2286 36.6898 91.7601 36.5682 92.17 36.3251C92.5798 36.0819 92.7883 35.7589 92.7952 35.3559C92.7883 34.9947 92.6285 34.7064 92.3158 34.491C92.0032 34.2687 91.5134 34.095 90.8465 33.97L88.0538 33.4385C86.449 33.1467 85.2541 32.6083 84.469 31.8233C83.684 31.0313 83.295 30.024 83.3019 28.8013C83.295 27.7314 83.5798 26.8179 84.1564 26.0606C84.733 25.2965 85.5528 24.7129 86.6157 24.31C87.6786 23.907 88.9326 23.7056 90.3776 23.7056C92.5451 23.7056 94.2541 24.1606 95.5046 25.0707C96.7551 25.9738 97.4463 27.2174 97.5783 28.8013Z" fill="#C848FF"/>
            <path d="M70.9216 40.1912C69.9004 40.1912 68.9938 40.0209 68.2018 39.6805C67.4168 39.3332 66.795 38.8121 66.3365 38.1174C65.885 37.4158 65.6592 36.537 65.6592 35.481C65.6592 34.5918 65.8155 33.8415 66.1281 33.2301C66.4407 32.6188 66.8715 32.122 67.4203 31.7399C67.9691 31.3579 68.6013 31.0695 69.3169 30.875C70.0324 30.6736 70.7966 30.5381 71.6094 30.4686C72.5195 30.3853 73.2524 30.2984 73.8082 30.2081C74.364 30.1108 74.7669 29.9754 75.017 29.8017C75.274 29.6211 75.4026 29.3675 75.4026 29.041V28.9889C75.4026 28.4539 75.2185 28.0406 74.8503 27.7488C74.4821 27.457 73.9853 27.3111 73.3601 27.3111C72.6862 27.3111 72.1443 27.457 71.7345 27.7488C71.3246 28.0406 71.0641 28.4435 70.9529 28.9576L66.2532 28.7909C66.3921 27.8183 66.7499 26.9499 67.3265 26.1857C67.9101 25.4146 68.709 24.8102 69.7233 24.3725C70.7445 23.9279 71.9707 23.7056 73.4018 23.7056C74.423 23.7056 75.3643 23.8271 76.2258 24.0703C77.0872 24.3065 77.8375 24.6539 78.4767 25.1124C79.1158 25.5639 79.6091 26.1197 79.9564 26.7797C80.3107 27.4397 80.4879 28.1934 80.4879 29.041V39.9202H75.6943V37.6902H75.5693C75.2845 38.2321 74.9197 38.6906 74.4751 39.0657C74.0374 39.4409 73.5199 39.7222 72.9224 39.9098C72.3319 40.0974 71.665 40.1912 70.9216 40.1912ZM72.4952 36.8565C73.044 36.8565 73.5372 36.7454 73.9749 36.5231C74.4195 36.3008 74.7738 35.9951 75.0378 35.606C75.3018 35.21 75.4338 34.7515 75.4338 34.2305V32.7091C75.2879 32.7855 75.1108 32.855 74.9024 32.9175C74.7009 32.98 74.4786 33.0391 74.2354 33.0946C73.9923 33.1502 73.7422 33.1988 73.4851 33.2405C73.2281 33.2822 72.9815 33.3204 72.7453 33.3552C72.2659 33.4316 71.856 33.5497 71.5156 33.7095C71.1822 33.8692 70.9251 34.0777 70.7445 34.3347C70.5708 34.5848 70.484 34.8835 70.484 35.2309C70.484 35.7589 70.6715 36.1618 71.0467 36.4397C71.4288 36.7176 71.9116 36.8565 72.4952 36.8565Z" fill="#C848FF"/>
            <path d="M56.3716 40.2224C54.6835 40.2224 53.235 39.8751 52.0262 39.1803C50.8243 38.4856 49.9004 37.52 49.2543 36.2834C48.6082 35.0398 48.2852 33.6018 48.2852 31.9692C48.2852 30.3297 48.6082 28.8916 49.2543 27.655C49.9073 26.4115 50.8348 25.4424 52.0366 24.7476C53.2454 24.0529 54.687 23.7056 56.3612 23.7056C57.841 23.7056 59.1297 23.973 60.2273 24.508C61.3319 25.0429 62.1933 25.8001 62.8116 26.7797C63.4369 27.7523 63.7669 28.8951 63.8016 30.2081H59.0393C58.9421 29.3883 58.6642 28.7457 58.2057 28.2803C57.7541 27.8148 57.1636 27.5821 56.4342 27.5821C55.8437 27.5821 55.3261 27.7488 54.8815 28.0823C54.4369 28.4088 54.0895 28.8951 53.8394 29.5412C53.5963 30.1803 53.4747 30.9723 53.4747 31.9171C53.4747 32.8619 53.5963 33.6608 53.8394 34.3139C54.0895 34.9599 54.4369 35.4497 54.8815 35.7832C55.3261 36.1097 55.8437 36.273 56.4342 36.273C56.9066 36.273 57.3234 36.1722 57.6846 35.9708C58.0528 35.7693 58.355 35.474 58.5913 35.085C58.8275 34.689 58.9768 34.2097 59.0393 33.6469H63.8016C63.753 34.9669 63.423 36.1201 62.8116 37.1066C62.2072 38.0931 61.3562 38.8608 60.2586 39.4096C59.1679 39.9515 57.8722 40.2224 56.3716 40.2224Z" fill="#C848FF"/>
            <path d="M143.898 16.3833V0.377038H148.848V3.29484H149.015C149.307 2.23887 149.783 1.45385 150.443 0.939757C151.103 0.418721 151.87 0.158203 152.746 0.158203C152.982 0.158203 153.225 0.175571 153.475 0.210307C153.725 0.238095 153.958 0.283252 154.173 0.345777V4.77458C153.93 4.69122 153.611 4.62522 153.215 4.57659C152.826 4.52796 152.478 4.50364 152.172 4.50364C151.568 4.50364 151.023 4.63911 150.536 4.91005C150.057 5.17404 149.678 5.54572 149.401 6.02507C149.13 6.49748 148.994 7.05325 148.994 7.69239V16.3833H143.898Z" fill="white"/>
            <path d="M135.569 9.47425V0.376953H140.654V16.3832H135.798V13.4029H135.632C135.277 14.3824 134.673 15.1605 133.818 15.7371C132.971 16.3068 131.946 16.5916 130.744 16.5916C129.654 16.5916 128.695 16.3415 127.868 15.8413C127.042 15.3411 126.399 14.6429 125.94 13.7467C125.482 12.8436 125.249 11.7876 125.242 10.5788V0.376953H130.338V9.57845C130.345 10.4468 130.574 11.1311 131.026 11.6313C131.477 12.1315 132.092 12.3816 132.87 12.3816C133.377 12.3816 133.832 12.2705 134.235 12.0482C134.645 11.8189 134.968 11.4889 135.204 11.0582C135.448 10.6205 135.569 10.0925 135.569 9.47425Z" fill="white"/>
            <path d="M114.545 16.6856C112.864 16.6856 111.419 16.3417 110.21 15.6539C109.009 14.9592 108.081 13.9935 107.428 12.7569C106.782 11.5134 106.459 10.0719 106.459 8.43234C106.459 6.78586 106.782 5.34433 107.428 4.10773C108.081 2.86419 109.009 1.89854 110.21 1.21077C111.419 0.516058 112.864 0.168701 114.545 0.168701C116.227 0.168701 117.668 0.516058 118.87 1.21077C120.079 1.89854 121.006 2.86419 121.652 4.10773C122.305 5.34433 122.632 6.78586 122.632 8.43234C122.632 10.0719 122.305 11.5134 121.652 12.7569C121.006 13.9935 120.079 14.9592 118.87 15.6539C117.668 16.3417 116.227 16.6856 114.545 16.6856ZM114.577 12.8403C115.188 12.8403 115.706 12.6527 116.129 12.2776C116.553 11.9024 116.876 11.3814 117.099 10.7145C117.328 10.0475 117.442 9.27641 117.442 8.40107C117.442 7.51184 117.328 6.73376 117.099 6.06683C116.876 5.3999 116.553 4.87887 116.129 4.50372C115.706 4.12858 115.188 3.941 114.577 3.941C113.945 3.941 113.41 4.12858 112.972 4.50372C112.541 4.87887 112.211 5.3999 111.982 6.06683C111.76 6.73376 111.649 7.51184 111.649 8.40107C111.649 9.27641 111.76 10.0475 111.982 10.7145C112.211 11.3814 112.541 11.9024 112.972 12.2776C113.41 12.6527 113.945 12.8403 114.577 12.8403Z" fill="white"/>
            <path d="M79.9072 16.3833V0.377115H84.7529V3.31576H84.93C85.2635 2.34316 85.8262 1.5755 86.6182 1.01278C87.4101 0.450061 88.355 0.168701 89.4526 0.168701C90.5642 0.168701 91.5159 0.453534 92.3079 1.0232C93.0999 1.59287 93.6035 2.35705 93.8189 3.31576H93.9856C94.2844 2.364 94.8679 1.60329 95.7363 1.03362C96.6047 0.457008 97.6294 0.168701 98.8104 0.168701C100.325 0.168701 101.555 0.655001 102.499 1.6276C103.444 2.59326 103.917 3.92016 103.917 5.60832V16.3833H98.8208V6.77544C98.8208 5.97652 98.6159 5.36864 98.206 4.95181C97.7961 4.52804 97.2647 4.31615 96.6117 4.31615C95.91 4.31615 95.3577 4.54541 94.9548 5.00392C94.5588 5.45548 94.3608 6.06336 94.3608 6.82754V16.3833H89.463V6.72334C89.463 5.97999 89.2616 5.39296 88.8586 4.96223C88.4557 4.53151 87.9242 4.31615 87.2643 4.31615C86.8196 4.31615 86.4271 4.42383 86.0867 4.63919C85.7463 4.84761 85.4788 5.14633 85.2843 5.53537C85.0967 5.92441 85.003 6.38293 85.003 6.91091V16.3833H79.9072Z" fill="white"/>
            <path d="M71.5779 9.47425V0.376953H76.6632V16.3832H71.8072V13.4029H71.6404C71.2861 14.3824 70.6817 15.1605 69.8272 15.7371C68.9797 16.3068 67.955 16.5916 66.7531 16.5916C65.6624 16.5916 64.7037 16.3415 63.877 15.8413C63.0503 15.3411 62.4077 14.6429 61.9492 13.7467C61.4907 12.8436 61.2579 11.7876 61.251 10.5788V0.376953H66.3467V9.57845C66.3537 10.4468 66.5829 11.1311 67.0345 11.6313C67.486 12.1315 68.1009 12.3816 68.8789 12.3816C69.3861 12.3816 69.8411 12.2705 70.2441 12.0482C70.6539 11.8189 70.977 11.4889 71.2132 11.0582C71.4563 10.6205 71.5779 10.0925 71.5779 9.47425Z" fill="white"/>
            <path d="M48.9004 16.3833V0.377038H53.8502V3.29484H54.017C54.3087 2.23887 54.7846 1.45385 55.4446 0.939757C56.1046 0.418721 56.8722 0.158203 57.7476 0.158203C57.9838 0.158203 58.2269 0.175571 58.477 0.210307C58.7271 0.238095 58.9599 0.283252 59.1752 0.345777V4.77458C58.9321 4.69122 58.6125 4.62522 58.2165 4.57659C57.8275 4.52796 57.4801 4.50364 57.1744 4.50364C56.57 4.50364 56.0247 4.63911 55.5384 4.91005C55.059 5.17404 54.6804 5.54572 54.4025 6.02507C54.1316 6.49748 53.9961 7.05325 53.9961 7.69239V16.3833H48.9004Z" fill="white"/>
            <defs>
            <filter id="filter0_d_83_3039" x="3.57324" y="13.3662" width="22.7031" height="27.2893" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="2"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_83_3039"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_83_3039" result="shape"/>
            </filter>
            <filter id="filter1_d_83_3039" x="19.3408" y="13.3662" width="22.7031" height="27.2893" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="2"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_83_3039"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_83_3039" result="shape"/>
            </filter>
            <filter id="filter2_d_83_3039" x="20.0186" y="19.6851" width="14.6514" height="14.6516" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="2"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_83_3039"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_83_3039" result="shape"/>
            </filter>
            <filter id="filter3_d_83_3039" x="4.27344" y="19.6851" width="14.6514" height="14.6516" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="2"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_83_3039"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_83_3039" result="shape"/>
            </filter>
            <linearGradient id="paint0_linear_83_3039" x1="4.60362" y1="1.38089" x2="32.1225" y2="103.443" gradientUnits="userSpaceOnUse">
            <stop stop-color="#C848FF"/>
            <stop offset="0.415" stop-color="#782B99"/>
            <stop offset="1" stop-color="#C848FF"/>
            </linearGradient>
            <clipPath id="clip0_83_3039">
            <rect x="0.84375" width="40" height="40" rx="4" fill="white"/>
            </clipPath>
            </defs>
            </svg>
        </g>
        
        <!-- Date -->
        <text x="${config.width - config.padding - 30}" y="28" 
              fill="#C146F6" font-size="20" font-family="Arial, sans-serif" 
              text-anchor="end">
          ${new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </text>
      </g>
    </svg>
  `;

  return svg;
};

const generateImageElement = (embed: Cast["embeds"][0], config: CardConfig) => {
  if (!embed?.metadata?.image) return "";

  const imageHeight = Math.min(
    embed.metadata.image.height_px || config.maxImageHeight,
    config.maxImageHeight
  );
  const imageWidth = embed.metadata.image.width_px
    ? (embed.metadata.image.width_px / embed.metadata.image.height_px) *
      imageHeight
    : imageHeight;

  return `
      <g transform="translate(${config.padding}, ${config.padding + 100})">
        <clipPath id="imageClip">
          <rect width="${imageWidth}" height="${imageHeight}" rx="12" ry="12"/>
        </clipPath>
        <image 
          href="${embed.url}"
          width="${imageWidth}"
          height="${imageHeight}"
          clip-path="url(#imageClip)"
        />
      </g>
    `;
};

const generateQuotedCastElement = (
  quotedCast: NonNullable<Cast["embeds"][0]["cast"]>,
  config: CardConfig
) => {
  if (!quotedCast?.author?.username) return "";

  return `
      <g transform="translate(${config.padding}, ${config.padding + 100})">
        <rect width="${config.width - config.padding * 2}" height="120" 
              rx="12" ry="12" fill="rgba(255,255,255,0.1)"/>
        <text x="20" y="30" fill="white" font-size="16" font-family="Arial, sans-serif">
          @${escapeText(quotedCast.author.username)}
        </text>
        <text x="20" y="60" fill="#ccc" font-size="14" font-family="Arial, sans-serif">
          ${escapeText(quotedCast.text || "")}
        </text>
      </g>
    `;
};

export default generateCastCard;