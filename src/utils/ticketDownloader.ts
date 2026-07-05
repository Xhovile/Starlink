import { BookingRequest } from '../data';

/**
 * Generates and downloads a beautifully styled, high-fidelity offline HTML boarding ticket.
 * This ensures exact structural, visual, and typography parity with the on-screen card.
 */
export function downloadTicket(booking: BookingRequest) {
  const farePerPassenger = booking.isRoundTrip ? 50000 : (booking.serviceClass === 'VIP' ? 45000 : 35000);
  const totalFare = booking.passengers * farePerPassenger;

  // Custom barcode lines generator matching the ticket barcode using SVG for reliable printing
  const barcodeVals = [4, 2, 6, 1, 8, 3, 5, 1, 7, 2, 9, 4, 3, 1, 5, 8, 2, 6, 3, 1, 9, 4, 2, 7, 3];
  let currentX = 0;
  const barcodeHtml = `<svg height="100%" width="100%" preserveAspectRatio="none">` + 
    barcodeVals.map((val) => {
      const rect = `<rect x="${currentX}" y="0" width="${val * 1.5}" height="100%" fill="#ffffff" />`;
      currentX += (val * 1.5) + 3;
      return rect;
    }).join('') + 
    `</svg>`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Starlink Tours - Boarding Pass [${booking.bookingRef}]</title>
  
  <!-- Font imports mirroring application design -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN for styling -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            serif: ['Playfair Display', 'Georgia', 'serif'],
          },
          colors: {
            ink: '#1a1a1a',
            paper: '#fcfaf7',
            gold: '#c5a059',
          }
        }
      }
    }
  </script>

  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #fcfaf7;
      color: #1a1a1a;
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
      border-color: rgba(26, 26, 26, 0.15);
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
        border: 1px solid #1a1a1a !important;
        box-shadow: none !important;
        margin-top: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        background-color: #eedfc8 !important;
      }
    }
  </style>
</head>
<body class="py-12 px-4 sm:px-6">

  <!-- Floating Utility Toolbar -->
  <div class="max-w-4xl mx-auto mb-8 no-print">
    <div class="bg-[#1a1a1a] text-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gold/30">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c5a059" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <div>
          <h4 class="font-bold text-xs uppercase tracking-wider text-white">Official Boarding Pass Document</h4>
          <p class="text-[10px] text-gray-400">Ready for offline presentation, digital wallet, or physical print.</p>
        </div>
      </div>
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <button onclick="window.print()" class="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#c5a059] hover:bg-[#b08e4d] text-[#1a1a1a] px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Print / Save PDF
        </button>
        <button onclick="window.close()" class="flex-1 sm:flex-initial flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
          Close Preview
        </button>
      </div>
    </div>
  </div>

  <!-- Primary Ticket Body -->
  <div class="max-w-4xl mx-auto bg-[#eedfc8] border border-ink shadow-lg ticket-container">
    
    <!-- Ticket Header Banner -->
    <div class="bg-[#0b1d3a] text-paper px-6 py-5 flex items-center justify-between border-b border-ink-fade">
      <div class="flex items-center gap-3">
        <div class="flex h-8 w-8 items-center justify-center bg-white text-ink">
          <!-- Bus Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 6v6"></path>
            <path d="M16 6v6"></path>
            <path d="M4 18V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9"></path>
            <path d="M4 14h16"></path>
            <circle cx="8" cy="18" r="2"></circle>
            <circle cx="16" cy="18" r="2"></circle>
            <path d="M4 10h16"></path>
            <path d="M10 14h4"></path>
          </svg>
        </div>
        <div>
          <span class="serif font-bold tracking-tight text-white block text-sm uppercase">STARLINK TOURS</span>
          <span class="text-[9px] uppercase tracking-widest text-gold font-bold block">Boarding Request Pass</span>
        </div>
      </div>
      <div class="text-right">
        <span class="text-[9px] text-white/40 uppercase font-bold block">Status</span>
        <span class="text-[10px] text-gold font-bold uppercase tracking-widest border border-gold/30 px-2 py-0.5 mt-1 inline-block">
          ${booking.status}
        </span>
      </div>
    </div>

    <!-- Ticket Grid Content -->
    <div class="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 relative">
      
      <!-- Dotted Tear-Line Separator (Visible on md+ screens) -->
      <div class="hidden md:block absolute right-[28%] top-0 bottom-0 border-r border-dashed border-ink-fade"></div>

      <!-- Left 8 columns: Journey and Passenger stats -->
      <div class="md:col-span-8 space-y-6">
        
        <!-- Stations Visual Banner -->
        <div class="flex items-center justify-between bg-white p-4 border border-ink-fade">
          <div>
            <span class="text-[9px] uppercase tracking-wider font-bold text-ink/40 block">Departure From</span>
            <span class="serif text-lg font-bold text-ink">${booking.departureCity}</span>
            <span class="text-[10px] text-ink/60 block">${booking.departureCity === 'Blantyre' ? 'Wenela Terminal' : 'Area 3 Terminal'}</span>
          </div>
          <div class="flex flex-col items-center px-2">
            <!-- Vector coach icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 6v6"></path><path d="M16 6v6"></path>
              <path d="M4 18V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9"></path>
              <path d="M4 14h16"></path><path d="M10 14h4"></path>
            </svg>
            <div class="h-[1px] w-12 sm:w-20 bg-ink-fade my-1.5"></div>
            <span class="text-[9px] text-ink/50 uppercase font-bold">4.5h Express</span>
          </div>
          <div class="text-right">
            <span class="text-[9px] uppercase tracking-wider font-bold text-ink/40 block">Destination</span>
            <span class="serif text-lg font-bold text-ink">${booking.destinationCity}</span>
            <span class="text-[10px] text-ink/60 block">${booking.destinationCity === 'Blantyre' ? 'Wenela Terminal' : 'Area 3 Terminal'}</span>
          </div>
        </div>

        <!-- Passenger info grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-5 text-xs">
          <div>
            <span class="text-[9px] uppercase tracking-wider font-bold text-ink/40 block mb-0.5">Passenger Name</span>
            <span class="font-semibold text-ink">${booking.fullName}</span>
          </div>
          <div>
            <span class="text-[9px] uppercase tracking-wider font-bold text-ink/40 block mb-0.5">Phone Number</span>
            <span class="font-semibold text-ink">${booking.phoneNumber}</span>
          </div>
          <div>
            <span class="text-[9px] uppercase tracking-wider font-bold text-ink/40 block mb-0.5">Travel Date</span>
            <span class="font-semibold text-ink">${booking.travelDate}</span>
          </div>
          <div>
            <span class="text-[9px] uppercase tracking-wider font-bold text-ink/40 block mb-0.5">Departure Choice</span>
            <span class="font-semibold text-ink">${booking.departureTime}</span>
          </div>
          <div>
            <span class="text-[9px] uppercase tracking-wider font-bold text-ink/40 block mb-0.5">Seat Class</span>
            <span class="inline-flex items-center gap-1 font-semibold text-ink">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gold inline shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              ${booking.isRoundTrip ? 'Round Trip Saver' : booking.serviceClass + ' Executive'}
            </span>
          </div>
          <div>
            <span class="text-[9px] uppercase tracking-wider font-bold text-ink/40 block mb-0.5">Passengers Count</span>
            <span class="font-semibold text-ink">${booking.passengers} Adult(s)</span>
          </div>
        </div>

        ${
          booking.specialRequests
            ? `
        <!-- Special requests box -->
        <div class="p-3 bg-white border border-ink-fade text-xs rounded-none">
          <strong class="text-ink/40 uppercase tracking-wide text-[9px] block mb-1">Special Preferences</strong>
          <span class="text-ink/80 font-medium italic">“${booking.specialRequests}”</span>
        </div>`
            : ''
        }

      </div>

      <!-- Right 4 columns: Ticket coupon / barcode section -->
      <div class="md:col-span-4 bg-white border border-ink-fade p-4 flex flex-col justify-between text-center min-h-[180px]">
        <div>
          <span class="text-[9px] uppercase tracking-wider font-bold text-ink/40 block">Total Est. Fare</span>
          <span class="serif text-2xl font-bold text-ink block mt-1">
            MWK ${totalFare.toLocaleString()}
          </span>
          <span class="text-[9px] text-ink/50 block mt-0.5">Payable upon validation</span>
        </div>

        <!-- SVG barcode -->
        <div class="space-y-1.5 py-4">
          <div class="flex justify-center items-center h-10 w-full bg-ink px-2 overflow-hidden">
            <div class="flex items-center h-8 opacity-95">
              ${barcodeHtml}
            </div>
          </div>
          <span class="font-mono text-[9px] tracking-widest text-ink/50 block uppercase font-bold">
            ${booking.bookingRef}
          </span>
        </div>

        <span class="text-[9px] text-ink/40 italic block">
          Created: ${booking.createdAt || new Date().toLocaleDateString('en-MW')}
        </span>
      </div>

    </div>

    <!-- Instructions / Policy Section -->
    <div class="bg-white border-t border-ink-fade p-5 text-[10px] text-ink/75 leading-relaxed">
      <div class="flex items-start gap-2.5">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gold shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        <div>
          <strong>Important Passenger Advisory:</strong> To guarantee reservation validity, present this boarding request pass to a Starlink representative or confirm via WhatsApp. Passengers must arrive at least 30 minutes before departure time. Standard luggage allowance is 23kg. Capped at 80km/h maximum safe speed limit on the M1 highway.
        </div>
      </div>
    </div>

  </div>

  <div class="text-center mt-8 no-print text-[11px] text-ink/40">
    &copy; ${new Date().getFullYear()} Starlink Tours & Travel. Certified Premium Malawian Carrier.
  </div>

</body>
</html>`;

  // Create standard file download pipeline
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Starlink_BoardingPass_${booking.bookingRef}.html`;
  
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
