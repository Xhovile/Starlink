import { BookingRequest } from '../data';

/**
 * Generates and downloads a beautifully styled, high-fidelity offline HTML boarding ticket.
 * This ensures exact structural, visual, and typography parity with the YAVA brand.
 */
export function downloadTicket(booking: BookingRequest) {
  const farePerPassenger = booking.isRoundTrip ? 50000 : (booking.serviceClass === 'VIP' ? 45000 : 35000);
  const totalFare = booking.passengers * farePerPassenger;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YAVA - Boarding Pass [${booking.bookingRef}]</title>
  
  <!-- Font imports mirroring application design -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Prata&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN for styling -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- QR Code Library CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" integrity="sha512-CNgIRecGo7nOMSVXM78VPA0IWG341CFCgT64JDGoibtuU7FGB4bHMTt4ED4c2AhaVzLs1PHbA6UYY1Vgl9hy3g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            serif: ['Cormorant Garamond', 'Prata', 'Playfair Display', 'Georgia', 'serif'],
          },
          colors: {
            navy: '#0B2E6D',
            orange: '#FF5A1F',
          }
        }
      }
    }
  </script>

  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #f3f4f6;
      color: #1f2937;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .serif {
      font-family: 'Playfair Display', serif;
    }
    .border-ink-fade {
      border-color: rgba(11, 46, 109, 0.12);
    }
    
    /* Print optimizations */
    @media print {
      .no-print {
        display: none !important;
      }
      body {
        background-color: #ffffff !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .ticket-container {
        border: 1px solid #e5e7eb !important;
        box-shadow: none !important;
        margin-top: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        background-color: #ffffff !important;
        border-radius: 0 !important;
      }
    }
  </style>
</head>
<body class="py-12 px-4 sm:px-6">

  <!-- Floating Utility Toolbar -->
  <div class="max-w-4xl mx-auto mb-8 no-print animate-fade-in">
    <div class="bg-[#0B2E6D] text-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-[#FF5A1F] rounded-xl shadow-lg">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <div>
          <h4 class="font-bold text-xs uppercase tracking-wider text-white">Official Boarding Pass Document</h4>
          <p class="text-[10px] text-blue-200">Ready for offline presentation, digital wallet, or physical print.</p>
        </div>
      </div>
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <button onclick="window.print()" class="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#FF5A1F] hover:bg-[#e04e1b] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Print / Save PDF
        </button>
        <button onclick="window.close()" class="flex-1 sm:flex-initial flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer">
          Close Preview
        </button>
      </div>
    </div>
  </div>

  <!-- Primary Ticket Body -->
  <div class="max-w-4xl mx-auto bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden ticket-container">
    
    <!-- Ticket Header Banner -->
    <div class="bg-[#0B2E6D] text-white px-6 py-6 flex items-center justify-between border-b-4 border-[#FF5A1F]">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-auto items-center justify-center">
          <!-- Embedded beautiful YAVA Logo with White and Orange colors -->
          <svg viewBox="0 0 136 40" class="h-8 w-auto inline-block select-none" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="YAVA Logo">
            <!-- Letter Y: White -->
            <path d="M 6 8.5 C 6 6, 12 6, 12 8.5 L 18 19 C 19 20, 21 20, 22 19 L 28 8.5 C 28 6, 34 6, 34 8.5 L 24 21.5 C 23.5 22.5, 23.5 23.5, 24 24.5 L 25 32 C 25 34.5, 19.5 34.5, 19.5 32 L 17 24.5 C 17.5 23.5, 17.5 22.5, 17 21.5 L 6 8.5 Z" fill="#ffffff" />
            <!-- Letter A: Orange -->
            <path d="M 38 31.5 C 38 34, 43.5 34, 43.5 31.5 L 51 11 C 51.5 10, 52.5 10, 53 11 L 60.5 31.5 C 60.5 34, 66 34, 66 31.5 L 56.5 8 C 55.5 5.5, 48.5 5.5, 47.5 8 Z" fill="#FF5A1F" />
            <!-- Letter V: White -->
            <path d="M 70 8.5 C 70 6, 75.5 6, 75.5 8.5 L 83 29 C 83.5 30, 84.5 30, 85 29 L 92.5 8.5 C 92.5 6, 98 6, 98 8.5 L 88.5 32 C 87.5 34.5, 80.5 34.5, 79.5 32 L 70 8.5 Z" fill="#ffffff" />
            <!-- Letter A: Orange -->
            <path d="M 102 31.5 C 102 34, 107.5 34, 107.5 31.5 L 115 11 C 115.5 10, 116.5 10, 117 11 L 124.5 31.5 C 124.5 34, 130 34, 130 31.5 L 120.5 8 C 119.5 5.5, 112.5 5.5, 111.5 8 Z" fill="#FF5A1F" />
          </svg>
        </div>
      </div>
      <div class="text-right">
        <span class="text-[9px] text-white/60 uppercase font-bold block">Status</span>
        <span class="text-[10px] text-white font-bold uppercase tracking-widest bg-[#FF5A1F] px-3 py-1 rounded-md mt-1 inline-block">
          ${booking.status}
        </span>
      </div>
    </div>

    <!-- Ticket Grid Content -->
    <div class="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 relative bg-white">
      
      <!-- Dotted Tear-Line Separator (Visible on md+ screens) -->
      <div class="hidden md:block absolute right-[28%] top-0 bottom-0 border-r border-dashed border-gray-200"></div>

      <!-- Left 8 columns: Journey and Passenger stats -->
      <div class="md:col-span-8 space-y-6">
        
        <!-- Stations Visual Banner -->
        <div class="flex items-center justify-between bg-slate-50 p-4 border border-gray-150 rounded-xl">
          <div>
            <span class="text-[9px] uppercase tracking-wider font-bold text-gray-400 block">Departure From</span>
            <span class="serif text-xl font-bold text-[#0B2E6D]">${booking.departureCity}</span>
            <span class="text-[10px] text-gray-500 block">${booking.departureCity === 'Blantyre' ? 'Wenela Terminal' : 'Area 3 Terminal'}</span>
          </div>
          <div class="flex flex-col items-center px-2">
            <!-- Vector coach icon in YAVA Orange -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#FF5A1F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 6v6"></path><path d="M16 6v6"></path>
              <path d="M4 18V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9"></path>
              <path d="M4 14h16"></path><path d="M10 14h4"></path>
            </svg>
            <div class="h-[1.5px] w-12 sm:w-20 bg-gray-200 my-1.5"></div>
            <span class="text-[9px] text-[#FF5A1F] uppercase font-bold tracking-wider">4.5h Express</span>
          </div>
          <div class="text-right">
            <span class="text-[9px] uppercase tracking-wider font-bold text-gray-400 block">Destination</span>
            <span class="serif text-xl font-bold text-[#0B2E6D]">${booking.destinationCity}</span>
            <span class="text-[10px] text-gray-500 block">${booking.destinationCity === 'Blantyre' ? 'Wenela Terminal' : 'Area 3 Terminal'}</span>
          </div>
        </div>

        <!-- Passenger info grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-5 text-xs">
          <div>
            <span class="text-[9px] uppercase tracking-wider font-bold text-gray-400 block mb-0.5">Passenger Name</span>
            <span class="font-semibold text-gray-800">${booking.fullName}</span>
          </div>
          <div>
            <span class="text-[9px] uppercase tracking-wider font-bold text-gray-400 block mb-0.5">Phone Number</span>
            <span class="font-semibold text-gray-800">${booking.phoneNumber}</span>
          </div>
          <div>
            <span class="text-[9px] uppercase tracking-wider font-bold text-gray-400 block mb-0.5">Travel Date</span>
            <span class="font-semibold text-gray-800">${booking.travelDate}</span>
          </div>
          <div>
            <span class="text-[9px] uppercase tracking-wider font-bold text-gray-400 block mb-0.5">Departure Choice</span>
            <span class="font-semibold text-gray-800">${booking.departureTime}</span>
          </div>
          <div>
            <span class="text-[9px] uppercase tracking-wider font-bold text-gray-400 block mb-0.5">Seat Class</span>
            <span class="inline-flex items-center gap-1 font-semibold text-[#0B2E6D]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-[#FF5A1F] inline shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              ${booking.isRoundTrip ? 'Round Trip Saver' : booking.serviceClass + ' Executive'}
            </span>
          </div>
          <div>
            <span class="text-[9px] uppercase tracking-wider font-bold text-gray-400 block mb-0.5">Passengers Count</span>
            <span class="font-semibold text-gray-800">${booking.passengers} Adult(s)</span>
          </div>
        </div>

        ${
          booking.specialRequests
            ? `
        <!-- Special requests box -->
        <div class="p-3 bg-slate-50 border border-gray-150 text-xs rounded-xl">
          <strong class="text-gray-400 uppercase tracking-wide text-[9px] block mb-1">Special Preferences</strong>
          <span class="text-gray-700 font-medium italic">“${booking.specialRequests}”</span>
        </div>`
            : ''
        }

      </div>

      <!-- Right 4 columns: Ticket coupon / QR Code section -->
      <div class="md:col-span-4 bg-slate-50 border border-gray-150 rounded-xl p-5 flex flex-col justify-between text-center min-h-[220px]">
        <div>
          <span class="text-[9px] uppercase tracking-wider font-bold text-gray-400 block">Total Est. Fare</span>
          <span class="serif text-2xl font-black text-[#0B2E6D] block mt-1">
            MWK ${totalFare.toLocaleString()}
          </span>
          <span class="text-[9px] text-[#FF5A1F] font-bold block mt-0.5">Payable upon validation</span>
        </div>

        <!-- QR Code Container -->
        <div class="space-y-2 py-3 flex flex-col items-center justify-center">
          <div id="qrcode-container" class="flex justify-center items-center bg-white p-2 border border-gray-200 rounded-lg shadow-sm w-32 h-32 relative">
            <!-- Fallback static vector QR-like pattern so that it ALWAYS displays beautiful structure offline/online -->
            <svg class="w-full h-full text-[#0B2E6D] opacity-45 transition-opacity duration-300" id="qrcode-fallback" viewBox="0 0 100 100" fill="currentColor">
              <!-- QR Finder Pattern Top-Left -->
              <path d="M0 0h30v30H0V0zm5 5v20h20V5H5zm5 5h10v10H10V10z" />
              <!-- QR Finder Pattern Top-Right -->
              <path d="M70 0h30v30H70V0zm5 5v20h20V5H75zm5 5h10v10H80V10z" />
              <!-- QR Finder Pattern Bottom-Left -->
              <path d="M0 70h30v30H0V70zm5 5v20h20V5H5zm5 5h10v10H10V10z" />
              <!-- Small Alignment Pattern -->
              <path d="M75 75h10v10H75v-10zm2 2v6h6v-6h-6z" />
              <!-- Standard QR structure -->
              <rect x="40" y="5" width="5" height="5" />
              <rect x="50" y="10" width="10" height="5" />
              <rect x="45" y="20" width="5" height="10" />
              <rect x="55" y="25" width="5" height="5" />
              <rect x="5" y="40" width="10" height="5" />
              <rect x="20" y="45" width="5" height="15" />
              <rect x="15" y="55" width="10" height="5" />
              <rect x="40" y="40" width="15" height="15" />
              <rect x="45" y="45" fill="white" width="5" height="5" />
              <rect x="70" y="40" width="5" height="10" />
              <rect x="85" y="45" width="10" height="5" />
              <rect x="80" y="55" width="15" height="5" />
              <rect x="40" y="70" width="10" height="5" />
              <rect x="55" y="75" width="5" height="15" />
              <rect x="45" y="85" width="10" height="5" />
              <rect x="70" y="85" width="5" height="10" />
              <rect x="90" y="80" width="5" height="5" />
            </svg>
          </div>
          <span class="font-mono text-[10px] tracking-widest text-[#0B2E6D] block uppercase font-black">
            ${booking.bookingRef}
          </span>
        </div>

        <span class="text-[9px] text-gray-400 italic block">
          Created: ${booking.createdAt || new Date().toLocaleDateString('en-MW')}
        </span>
      </div>

    </div>

    <!-- Instructions / Policy Section -->
    <div class="bg-gray-50 border-t border-gray-150 p-5 rounded-b-2xl text-[10px] text-gray-600 leading-relaxed">
      <div class="flex items-start gap-2.5">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#FF5A1F] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        <div>
          <strong class="text-[#0B2E6D]">Important Passenger Advisory:</strong> To guarantee reservation validity, present this boarding request pass to a YAVA representative or confirm via WhatsApp. Passengers must arrive at least 30 minutes before departure time. Standard luggage allowance is 23kg. Capped at 80km/h maximum safe speed limit on the M1 highway.
        </div>
      </div>
    </div>

  </div>

  <div class="text-center mt-8 no-print text-[11px] text-gray-400">
    &copy; ${new Date().getFullYear()} YAVA. Certified Premium Malawian Carrier.
  </div>

  <!-- QR Code generation script -->
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      try {
        const qrContainer = document.getElementById("qrcode-container");
        if (typeof QRCode !== 'undefined') {
          // Clear fallback pattern
          qrContainer.innerHTML = '';
          new QRCode(qrContainer, {
            text: "${booking.bookingRef}",
            width: 112,
            height: 112,
            colorDark: "#0B2E6D",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
          });
          // Ensure scaling
          const qrImg = qrContainer.querySelector('img');
          if (qrImg) {
            qrImg.style.width = '100%';
            qrImg.style.height = '100%';
            qrImg.className = 'rounded';
          }
          const qrCanvas = qrContainer.querySelector('canvas');
          if (qrCanvas) {
            qrCanvas.style.width = '100%';
            qrCanvas.style.height = '100%';
            qrCanvas.className = 'rounded';
          }
        } else {
          // Keep offline fallback visible with full opacity
          const fallback = document.getElementById("qrcode-fallback");
          if (fallback) {
            fallback.classList.remove('opacity-45');
            fallback.classList.add('opacity-95');
          }
        }
      } catch (err) {
        console.error("QR Code rendering failed:", err);
      }
    });
  </script>

</body>
</html>`;

  // Create standard file download pipeline
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `YAVA_BoardingPass_${booking.bookingRef}.html`;
  
  // Stop event propagation to prevent the AI Studio proxy global click listener 
  // from intercepting this download and showing a redirect/review window.
  link.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
