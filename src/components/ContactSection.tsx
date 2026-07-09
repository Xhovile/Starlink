import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Plus, Minus, Send, CheckCircle2 } from 'lucide-react';
import { OFFICE_CONTACTS, FREQUENT_QUESTIONS } from '../data';
import { useLanguage } from '../context/LanguageContext';

export default function ContactSection() {
  const { language, t } = useLanguage();

  // Accordion toggle state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Message Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [messageSubmitted, setMessageSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) {
      const alertMsg = language === 'en' ? 'Please fill out your Name and Message.' : 'Chonde lembani Dzina lanu ndi Uthenga.';
      alert(alertMsg);
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setMessageSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 1000);
  };

  const faqList = [
    {
      question: language === 'en' 
        ? "How do I secure my seat reservation?" 
        : "Kodi ndimasungitsa bwanji malo anga?",
      answer: language === 'en'
        ? "Simply complete our digital booking form. Once submitted, tap the 'Confirm Ticket WhatsApp' button. This sends your pass to our 24/7 supervisor desk to lock in your seat and allocate your ticket number."
        : "Lembani fomu yathu yosungitsira malo pa intaneti. Mukamaliza, dinani batani la 'Confirm Ticket WhatsApp' kuti mutumize kwa oyang'anira athu kuti akutsimikizireni malo ndi kukupatsani nambala ya tikiti."
    },
    {
      question: language === 'en'
        ? "What is the luggage allowance policy?"
        : "Kodi ndondomeko ya katundu ndi yotani?",
      answer: language === 'en'
        ? "Every passenger is allocated up to 23kg of checked baggage free of charge, which is placed securely in our lower cargo compartments. Carry-on handbags under 5kg are welcome inside the cabin."
        : "Wokwera aliyense amaloledwa katundu wolemera mpaka 23kg kwaulere, yemwe amaikidwa bwino m'chipinda chapansi cha basi. Katundu wamanja osapitirira 5kg amaloledwa kulowa naye m'basi."
    },
    {
      question: language === 'en'
        ? "Can I reschedule or cancel my trip?"
        : "Kodi nditha kusintha tsiku la ulendo kapena kufufuta?",
      answer: language === 'en'
        ? "Yes. Rescheduling is free of charge if requested at least 4 hours before your scheduled departure. Please contact our WhatsApp customer support center with your Ticket Reference to make changes."
        : "Eya. Kusintha tsiku la ulendo ndi kwaulere ngati mutapempha patatsala maola 4 kuti basi inyamuke. Chonde lankhulani nafe pa WhatsApp pothandizidwa ndi Nambala yanu ya Tikiti."
    },
    {
      question: language === 'en'
        ? "Where are your physical boarding terminals located?"
        : "Kodi ma terminal anu oyamukira ali kuti?",
      answer: language === 'en'
        ? "In Blantyre, boarding is at our Wenela Terminal Office on Chileka Road. In Lilongwe, boarding takes place at our Area 3 Gateway Lounge Terminal, conveniently located along the M1 highway."
        : "Ku Blantyre, timanyamukira ku ofesi yathu ya Wenela Terminal pamsewu wa Chileka. Ku Lilongwe, timanyamukira ku Area 3 Gateway Lounge Terminal, m'mbali mwa msewu waukulu wa M1."
    }
  ];

  return (
    <div className="py-16 bg-paper text-ink border-b border-ink-fade">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Contact Info Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold mb-3 block">
            {language === 'en' ? 'Connect With Us' : 'Lankhulani Nafe'}
          </span>
          <h2 className="serif text-3xl sm:text-4xl font-bold text-ink mt-3 tracking-tight">
            {language === 'en' ? 'We are Available 24/7 For Bookings' : 'Tili Nanu Maola 24/7 pa Maulendo Anu'}
          </h2>
          <p className="text-ink/70 mt-4 text-xs sm:text-sm max-w-xl mx-auto">
            {language === 'en'
              ? 'Have questions about fares, schedules, luggage policies, or corporate hires? Send our dispatch team a quick message or call us instantly.'
              : 'Kodi muli ndi mafunso okhudza mitengo, nthawi ya ulendo, katundu kapena kubwereketsa basi? Tumizani utenga kapena tiyimbireni foni tsopano.'}
          </p>
        </div>

        {/* Contact Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Column 1: Info Cards and Terminal Details */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick stats / contacts */}
            <div className="bg-ink text-paper rounded-none p-8 space-y-6 border border-ink-fade relative overflow-hidden">
              <h3 className="serif text-lg font-bold text-gold">
                {language === 'en' ? 'Dispatch Support Hotline' : 'Nambala Zothandizira'}
              </h3>
              
              <div className="space-y-4">
                <a 
                  href={`tel:${OFFICE_CONTACTS.phone}`}
                  className="flex items-center gap-4 p-4 rounded-none bg-white/5 border border-white/10 hover:border-gold/30 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center bg-gold text-white shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] text-paper/50 uppercase font-bold tracking-wider">
                      {language === 'en' ? 'Call Center Phone' : 'Foni ya Ofesi'}
                    </span>
                    <span className="text-xs font-bold text-white tracking-wide">{OFFICE_CONTACTS.phone}</span>
                  </div>
                </a>

                <a 
                  href={`https://wa.me/${OFFICE_CONTACTS.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-none bg-emerald-950/25 border border-emerald-500/20 hover:border-emerald-400/40 transition-colors text-left"
                >
                  <div className="flex h-10 w-10 items-center justify-center bg-emerald-600 text-white shrink-0">
                    <MessageSquare className="h-4 w-4 fill-current" />
                  </div>
                  <div>
                    <span className="block text-[9px] text-emerald-400 uppercase font-bold tracking-wider">
                      {language === 'en' ? 'Instant WhatsApp Desk' : 'WhatsApp Desk Lathu'}
                    </span>
                    <span className="text-xs font-bold text-white tracking-wide">{OFFICE_CONTACTS.whatsapp}</span>
                  </div>
                </a>

                <a 
                  href={`mailto:${OFFICE_CONTACTS.email}`}
                  className="flex items-center gap-4 p-4 rounded-none bg-white/5 border border-white/10 hover:border-gold/30 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center bg-white/10 text-paper shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] text-paper/50 uppercase font-bold tracking-wider">
                      {language === 'en' ? 'Email Reservations' : 'Imelo ya Reservations'}
                    </span>
                    <span className="text-xs font-bold text-white tracking-wide">{OFFICE_CONTACTS.email}</span>
                  </div>
                </a>
              </div>

              <div className="pt-4 border-t border-white/10 text-[10px] text-paper/60 italic leading-relaxed">
                <span>
                  {language === 'en'
                    ? '* Tickets can be booked via our system 24/7. Physical offices operate during boarding hours.'
                    : '* Matikiti akhoza kusungidwa pa intaneti maola 24/7. Maofesi enieni amagwira ntchito nthawi yonyamuka.'}
                </span>
              </div>
            </div>

            {/* Terminal Addresses */}
            <div className="bg-white border border-ink-fade rounded-none p-8 space-y-6">
              <h3 className="serif text-lg font-bold text-ink">
                {language === 'en' ? 'Physical Terminals' : 'Maofesi Enieni'}
              </h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="h-4 w-4 text-gold shrink-0 mt-1" />
                  <div className="text-xs">
                    <strong className="serif text-sm font-bold text-ink block">
                      {language === 'en' ? 'Blantyre Departure Terminal (Wenela)' : 'Malo Onyamukira Blantyre (Wenela)'}
                    </strong>
                    <p className="text-ink/70 mt-1 leading-relaxed">{OFFICE_CONTACTS.blantyre.address}</p>
                    <span className="text-ink/50 mt-2 block flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold">
                      <Clock className="h-3 w-3" /> {language === 'en' ? 'Open:' : 'Maola:'} {OFFICE_CONTACTS.blantyre.hours}
                    </span>
                  </div>
                </div>

                <div className="h-[1px] bg-ink-fade"></div>

                <div className="flex gap-4">
                  <MapPin className="h-4 w-4 text-gold shrink-0 mt-1" />
                  <div className="text-xs">
                    <strong className="serif text-sm font-bold text-ink block">
                      {language === 'en' ? 'Lilongwe Area 3 Station (Gateway Terminal)' : 'Malo Onyamukira Lilongwe Area 3 (Gateway)'}
                    </strong>
                    <p className="text-ink/70 mt-1 leading-relaxed">{OFFICE_CONTACTS.lilongwe.address}</p>
                    <span className="text-ink/50 mt-2 block flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold">
                      <Clock className="h-3 w-3" /> {language === 'en' ? 'Open:' : 'Maola:'} {OFFICE_CONTACTS.lilongwe.hours}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Column 2: Send Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-ink-fade rounded-none p-8 shadow-sm">
              {messageSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center bg-emerald-100 text-emerald-600 rounded-none mb-2">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="serif text-xl font-bold text-ink">
                    {language === 'en' ? 'Message Received!' : 'Uthenga Walandiridwa!'}
                  </h3>
                  <p className="text-ink/75 text-xs max-w-sm mx-auto leading-relaxed">
                    {language === 'en'
                      ? 'Thank you for contacting YAVA. Our reservations desk has received your request and will follow up with you shortly.'
                      : 'Zikomo kwambiri polankhula nafe. Landira uthenga wanu ndipo tikuyankhani posachedwa kwambiri.'}
                  </p>
                  <button
                    onClick={() => setMessageSubmitted(false)}
                    className="mt-6 px-6 py-2.5 bg-ink text-white text-xs font-bold uppercase tracking-widest hover:bg-gold transition-colors"
                  >
                    {language === 'en' ? 'Send Another Message' : 'Tumizani Uthenga Wina'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-6">
                  <div>
                    <h3 className="serif text-lg font-bold text-ink">
                      {language === 'en' ? 'Inquire Offline' : 'Tifunseni Funso'}
                    </h3>
                    <p className="text-[10px] text-ink/40 uppercase tracking-widest font-bold mt-1">
                      {language === 'en' ? 'Need customized schedules or packages? Leave a message.' : 'Kodi mukufuna ulendo kapena basi yobwereka? Siyani uthenga.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-ink/50 block">
                        {language === 'en' ? 'Your Full Name *' : 'Dzina Lanu Lonse *'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Chikondi Phiri"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border-b border-ink-fade py-2 text-sm focus:outline-none focus:border-gold bg-transparent text-ink font-medium rounded-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-ink/50 block">
                        {language === 'en' ? 'Email Address (Optional)' : 'Imelo Yanu (Mungasiye)'}
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. chikondi@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-b border-ink-fade py-2 text-sm focus:outline-none focus:border-gold bg-transparent text-ink font-medium rounded-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-ink/50 block">
                      {language === 'en' ? 'Inquiry Subject' : 'Mutu wa Uthenga'}
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full border-b border-ink-fade py-2 text-sm focus:outline-none focus:border-gold bg-transparent text-ink font-medium rounded-none"
                    >
                      <option value="General Inquiry">{language === 'en' ? 'General Inquiry / Fleet' : 'Zambiri za Basi / Maofesi'}</option>
                      <option value="Payment Validation">{language === 'en' ? 'Payment Validation Help' : 'Kutsimikizira Ndalama'}</option>
                      <option value="Baggage / Luggage">{language === 'en' ? 'Baggage / Luggage Limits' : 'Kulemera kwa Katundu'}</option>
                      <option value="Corporate Hire">{language === 'en' ? 'Corporate Coach Charters' : 'Kubwereka Basi Yathu'}</option>
                      <option value="Refund / Reschedule">{language === 'en' ? 'Refund or Rescheduling' : 'Kubweza kapena Kusintha Tsiku'}</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-ink/50 block">
                      {language === 'en' ? 'Your Message / Detailed Request *' : 'Uthenga Lanu kapena Pempho Lanu *'}
                    </label>
                    <textarea
                      rows={4}
                      placeholder={language === 'en' ? "Type your message or custom itinerary details here..." : "Lembani uthenga wanu pano..."}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="w-full border-b border-ink-fade py-2 text-sm focus:outline-none focus:border-gold bg-transparent text-ink font-medium rounded-none resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className={`w-full py-4 bg-gold hover:bg-ink text-white font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                      sending ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {sending ? (
                      <span>{language === 'en' ? 'Sending message...' : 'Kutumiza uthenga...'}</span>
                    ) : (
                      <span>{language === 'en' ? 'Submit Message' : 'Tumizani Uthenga'}</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* FAQ Section */}
        <div className="bg-white border border-ink-fade rounded-none p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-2 block">
              {language === 'en' ? 'Common Inquiries' : 'Mafunso Odziwika'}
            </span>
            <h3 className="serif text-2xl sm:text-3xl font-bold text-ink">
              {language === 'en' ? 'Frequently Asked Questions' : 'Mafunso Omwe Amafunsidwa Kawirikawiri'}
            </h3>
            <p className="text-ink/60 text-xs mt-1">
              {language === 'en'
                ? "Everything you need to know about Malawi's most reliable intercity luxury coach service."
                : 'Zonse zomwe muyenera kudziwa za mayendedwe odalirika kwambiri m\'Malawi pakati pa mizinda.'}
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {faqList.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className={`border rounded-none overflow-hidden transition-all ${
                    isOpen ? 'border-gold bg-paper/50' : 'border-ink-fade bg-transparent'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between font-bold text-xs uppercase tracking-widest text-ink focus:outline-none cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <span className="shrink-0 text-ink/50 ml-4">
                      {isOpen ? <Minus className="h-4 w-4 text-gold" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 text-xs text-ink/80 leading-relaxed border-t border-ink-fade pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
