import React from 'react';
import { ShieldCheck, Sparkles, Clock, Heart, Users, Compass, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AboutSection() {
  const { language } = useLanguage();

  const values = [
    {
      title: language === 'en' ? 'Pristine Safety & Compliance' : 'Chitetezo Chokwanira & Kutsatira Malamulo',
      description: language === 'en' 
        ? 'We adhere to the highest standard of road safety. Every luxury vehicle in our fleet features professional speed limiters capped at 80km/h, real-time satellite GPS tracking, and undergoes strict daily pre-trip maintenance inspections.'
        : 'Timatsatira malamulo apamwamba achitetezo pamsewu. Basi iliyonse ili ndi chipangizo chochepetsa liwiro la 80km/h, GPS yoti tiziwona komwe ili, ndipo imayesedwa tsiku lililonse musananyamuke.',
      icon: ShieldCheck,
    },
    {
      title: language === 'en' ? 'VIP Lounge Standard Comfort' : 'Chitonthozo cha Mtundu wa VIP Lounge',
      description: language === 'en'
        ? 'We believe intercity coach travel should be an experience, not just a commute. Our standard and VIP class seats are imported ergonomic models featuring generous legroom, soft hand-stitched leather upholstery, and pristine sanitation.'
        : 'Tikhulupirira kuti ulendo wapakati pa mizinda uyenera kukhala wokondweretsa. Mipando yathu ya Standard ndi VIP ndi yofewa, yosokedwa bwino ndi zikopa ndipo pali malo aakulu a mapazi anu.',
      icon: Sparkles,
    },
    {
      title: language === 'en' ? 'Unwavering On-Time Guarantee' : 'Chitsimikiziro Chosachedwa Nthawi Zonse',
      description: language === 'en'
        ? 'Time is your most valuable asset. We maintain a zero-delay policy for departures. If we say we leave at 07:30 AM, our engines start and we roll out exactly at 07:30 AM, ensuring you reach Lilongwe or Blantyre right on schedule.'
        : 'Nthawi ndiyo chuma chanu chachikulu. Ndondomeko yathu ndi yosachedwa ngakhale pang\'ono. Tikati tikunyamuka 07:30 AM, injini zimayaka ndipo timanyamuka nthawi yomweyo kuti mufike bwino pamene mukupita.',
      icon: Clock,
    },
  ];

  const fleetFeatures = [
    {
      title: language === 'en' ? 'Air Conditioned Fleet' : 'Mabasi Odzaza mpweya wozizira (AC)',
      description: language === 'en' ? 'Controlled interior climates for absolute coolness during warm Malawian days.' : 'Kutentha ndi kozizira koyendetsedwa mkati kuti muzimva bwino masiku otentha m\'Malawi.',
    },
    {
      title: language === 'en' ? 'Complimentary Wi-Fi' : 'Wi-Fi Kwaulere',
      description: language === 'en' ? 'High-speed internet throughout your entire journey across the M1 highway.' : 'Intaneti yamphamvu pa ulendo wanu wonse pamsewu waukulu wa M1.',
    },
    {
      title: language === 'en' ? 'Onboard USB Sockets' : 'Zolumikizira USB M\'mipando',
      description: language === 'en' ? 'Dedicated power slots on every seat to keep your smartphones and devices fully charged.' : 'Malo ochajira mafoni ndi zida zanu pampando uliwonse kuti musasowe mphamvu.',
    },
    {
      title: language === 'en' ? 'Complimentary Snacks' : 'Zotsekemera & Zakumwa',
      description: language === 'en' ? 'Premium mineral water and light snacks served by our dedicated cabin host.' : 'Madzi a m\'botolo abwino ndi zotsekemera zopepuka zoperekedwa ndi wolandira alendo athu.',
    },
    {
      title: language === 'en' ? 'Onboard Entertainment' : 'Zosangulutsa M\'basi',
      description: language === 'en' ? 'Premium overhead audio and clean video systems featuring serene travel journals.' : 'Zomvera ndi mavidiyo abwino owonetsa nkhani zosangalatsa zaulendo.',
    },
    {
      title: language === 'en' ? 'Prone Reclining Seats' : 'Mipando Yokhotakhota Bwino',
      description: language === 'en' ? 'Ergonomic plush seats that recline up to 140 degrees for tranquil rest.' : 'Mipando yabwino yomwe imakhoteka kufika madigiri 140 kuti mupumule bwino.',
    },
  ];

  return (
    <div className="bg-paper py-16 text-ink border-b border-ink-fade">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Intro Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold block">
              {language === 'en' ? 'Our Journey' : 'Ulendo Wathu'}
            </span>
            <h2 className="serif text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              {language === 'en' ? 'Redefining Luxury Travel Across Malawi' : 'Kusintha Maonekedwe a Ulendo Apamwamba mu Malawi'}
            </h2>
            <p className="text-ink/85 leading-relaxed text-xs sm:text-sm">
              {language === 'en'
                ? "Starlink Tours is Malawi's premium intercity transport provider, established with a clear mission: to provide comfortable, ultra-safe, and highly professional coach travel between Blantyre and Lilongwe."
                : "Starlink Tours ndi kampani yapamwamba ya mayendedwe m'Malawi yomwe idakhazikitsidwa ndi cholinga chomveka bwino: kupereka ulendo wabwino, otetezeka komanso odalirika pakati pa Blantyre ndi Lilongwe."}
            </p>
            <p className="text-ink/85 leading-relaxed text-xs sm:text-sm">
              {language === 'en'
                ? 'By investing in a modern fleet of custom-built luxury coaches and employing seasoned, highly-trained drivers, we have set a new benchmark for passenger expectation. From complimentary refreshments to individual seat-power, every detail is engineered for your satisfaction.'
                : 'Mwa kuyika ndalama pamabasi amakono komanso kulemba ntchito madalaivala ophunzitsidwa bwino, takhazikitsa njira yatsopano yoyendera. Kuyambira zakumwa zaulere mpaka malo ochajira, chilichonse chakonzedwa kuti mukondwere.'}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-gold" />
                <span className="text-xs font-bold uppercase tracking-wider text-ink">
                  {language === 'en' ? 'Air Conditioned Fleet' : 'Mabasi okhala ndi AC'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-gold" />
                <span className="text-xs font-bold uppercase tracking-wider text-ink">
                  {language === 'en' ? 'Complimentary Wi-Fi' : 'Wi-Fi Kwaulere'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-gold" />
                <span className="text-xs font-bold uppercase tracking-wider text-ink">
                  {language === 'en' ? 'Onboard USB Sockets' : 'Zochajira foni za USB'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-gold" />
                <span className="text-xs font-bold uppercase tracking-wider text-ink">
                  {language === 'en' ? 'Complementary Snacks' : 'Zakudya Zopepuka'}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            {/* Visual Callout block with Editorial touch */}
            <div className="relative rounded-none border border-ink-fade bg-white p-8 sm:p-10 text-ink shadow-sm min-h-[350px] flex flex-col justify-between">
              {/* Subtle design star in background */}
              <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                <Compass className="h-40 w-40 text-ink stroke-[1]" />
              </div>

              <div className="space-y-4 relative z-10">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold block">
                  {language === 'en' ? 'Executive Fleet Assurance' : 'Chitsimikiziro cha Mabasi Apamwamba'}
                </span>
                <h3 className="serif text-2xl font-bold tracking-tight text-ink leading-snug">
                  {language === 'en' ? 'Comfort is not optional. It is our standard.' : 'Chitonthozo si chosankha. Ndi muyezo wathu.'}
                </h3>
                <p className="text-xs text-ink/75 leading-relaxed max-w-md">
                  {language === 'en'
                    ? 'Whether traveling for business, a family weekend visit, or a tourist excursion on the M1 highway, our coaches offer the tranquil sanctuary you need to work, rest, and arrive fully recharged.'
                    : 'Kaya mukuyenda pabizinesi, kukaona achibale pamsika kapena alendo panjira ya M1, mabasi athu amakupatsani malo abwino ogwirira ntchito, kupumula, komanso kufika muli ndi mphamvu zatsopano.'}
                </p>
              </div>

              <div className="border-t border-ink-fade pt-6 mt-8 flex justify-between items-center relative z-10 text-xs">
                <div>
                  <span className="block font-bold text-gold uppercase tracking-wider">
                    {language === 'en' ? 'Blantyre Office' : 'Ofesi ya Blantyre'}
                  </span>
                  <span className="text-ink/60 font-medium">Wenela Terminal</span>
                </div>
                <div className="h-8 w-[1px] bg-ink-fade"></div>
                <div>
                  <span className="block font-bold text-gold uppercase tracking-wider">
                    {language === 'en' ? 'Lilongwe Office' : 'Ofesi ya Lilongwe'}
                  </span>
                  <span className="text-ink/60 font-medium">Area 3 Office</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Fleet Features Section */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold mb-2 block">
              {language === 'en' ? 'Premium Onboard Amenities' : 'Zothandizira Zapadera M\'basi'}
            </span>
            <h3 className="serif text-2xl sm:text-3xl font-bold text-ink">
              {language === 'en' ? 'Designed For the Discriminating Traveler' : 'Zokonzedwera Anthu Ozindikira Ubwino'}
            </h3>
            <p className="text-ink/60 text-xs mt-2">
              {language === 'en'
                ? 'Every seat booked on Starlink Tours comes loaded with executive features to maximize comfort.'
                : 'Mipando yonse yosungidwa pa Starlink Tours imabwera ndi zinthu zabwino kuti mukhale ndi chitonthozo chenicheni.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fleetFeatures.map((feat, index) => {
              return (
                <div 
                  key={index} 
                  className="p-8 bg-white border border-ink-fade rounded-none flex flex-col gap-4 shadow-sm"
                >
                  <div className="h-8 w-8 flex items-center justify-center rounded-none bg-ink text-paper">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="serif font-bold text-base text-ink">{feat.title}</h4>
                    <p className="text-xs text-ink/70 leading-relaxed mt-1">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white rounded-none p-8 sm:p-12 border border-ink-fade">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-2 block">
              {language === 'en' ? 'Our Pillar Principles' : 'Mfundo Yathu Yofunika kwambiri'}
            </span>
            <h3 className="serif text-2xl font-bold text-ink">
              {language === 'en' ? 'The Foundations of Starlink' : 'Maziko a Starlink'}
            </h3>
            <p className="text-ink/60 text-xs mt-1">
              {language === 'en'
                ? 'We operate under a strict code of professionalism and respect.'
                : 'Timagwira ntchito pansi pa malamulo okhhwima aukadaulo ndi ulemu.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {values.map((v, i) => {
              return (
                <div key={i} className="space-y-4 border-t border-ink-fade pt-6">
                  <span className="serif text-xs font-bold text-gold tracking-widest block">
                    {language === 'en' ? `PILLAR 0${i + 1}` : `CHINSINSI 0${i + 1}`}
                  </span>
                  <h4 className="serif font-bold text-lg text-ink">{v.title}</h4>
                  <p className="text-xs text-ink/75 leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
