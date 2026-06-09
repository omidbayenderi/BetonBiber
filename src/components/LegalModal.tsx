/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode, useEffect, useState } from 'react';
import { Cookie, FileText, Scale, ShieldCheck, X } from 'lucide-react';
import { ContactConfig, DEFAULT_PRICING_CONFIG, getPricingConfig } from '../lib/pricingState';

export type LegalSection = 'privacy' | 'terms' | 'imprint';

interface LegalModalProps {
  initialSection: LegalSection;
  onClose: () => void;
}

export default function LegalModal({ initialSection, onClose }: LegalModalProps) {
  const [activeSection, setActiveSection] = useState<LegalSection>(initialSection);
  const [pricingConfig, setPricingConfig] = useState(() => getPricingConfig());
  const contact: ContactConfig = { ...DEFAULT_PRICING_CONFIG.contact!, ...pricingConfig.contact };

  useEffect(() => {
    const handleUpdated = () => setPricingConfig(getPricingConfig());
    window.addEventListener('pricing_config_updated', handleUpdated);
    return () => window.removeEventListener('pricing_config_updated', handleUpdated);
  }, []);

  const openCookieSettings = () => {
    window.dispatchEvent(new Event('betonbiber_cookie_settings_open'));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-primary-navy/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[1.6rem] border border-white/70 bg-white shadow-[0_30px_120px_rgba(8,22,37,0.35)]">
        <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-950 p-5 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-[11px] font-black uppercase tracking-[0.22em] text-brand-orange">Legal Center</p>
            <h2 className="mt-1 font-display text-2xl font-black uppercase tracking-tight">
              Rechtliche Informationen
            </h2>
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/20 md:static"
            aria-label="Rechtliche Informationen schließen"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[260px_1fr]">
          <aside className="border-b border-slate-200 bg-slate-50 p-4 md:border-b-0 md:border-r">
            {[
              { id: 'privacy' as const, label: 'Datenschutz', icon: ShieldCheck },
              { id: 'terms' as const, label: 'Nutzungsbedingungen', icon: FileText },
              { id: 'imprint' as const, label: 'AGB / Impressum', icon: Scale }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`mb-2 flex min-h-11 w-full items-center gap-2 rounded-2xl px-4 text-left font-display text-xs font-black uppercase tracking-wider transition ${
                  activeSection === item.id
                    ? 'bg-primary-navy text-white shadow-lg shadow-primary-navy/15'
                    : 'text-slate-600 hover:bg-white hover:text-primary-navy'
                }`}
              >
                <item.icon size={15} />
                {item.label}
              </button>
            ))}
            <button
              onClick={openCookieSettings}
              className="mt-3 flex min-h-11 w-full items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 text-left font-display text-xs font-black uppercase tracking-wider text-brand-orange-dark transition hover:bg-orange-100"
            >
              <Cookie size={15} />
              Cookie-Einstellungen
            </button>
          </aside>

          <article className="overflow-y-auto p-5 md:p-8">
            {activeSection === 'privacy' && <PrivacyPolicy contact={contact} onCookieSettings={openCookieSettings} />}
            {activeSection === 'terms' && <TermsOfUse contact={contact} />}
            {activeSection === 'imprint' && <Imprint contact={contact} />}
          </article>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-7">
      <h3 className="font-display text-base font-black uppercase tracking-tight text-primary-navy">{title}</h3>
      <div className="mt-3 space-y-3 font-sans text-sm leading-7 text-slate-600">{children}</div>
    </section>
  );
}

function PrivacyPolicy({ contact, onCookieSettings }: { contact: ContactConfig; onCookieSettings: () => void }) {
  return (
    <div>
      <h1 className="font-display text-3xl font-black uppercase tracking-tight text-primary-navy">Datenschutzerklärung</h1>
      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">Stand: Juni 2026</p>

      <Section title="1. Verantwortlicher">
        <p>
          Verantwortlich im Sinne der Datenschutz-Grundverordnung ist {contact.companyName}, {contact.streetAddress}, {contact.postalCity}, {contact.country}.
          Vertreten durch: {contact.responsiblePerson}. E-Mail: {contact.email}, Telefon: {contact.phone}.
          Register- und steuerliche Angaben finden Sie im Impressum.
        </p>
      </Section>

      <Section title="2. Grundsätze der Verarbeitung">
        <p>
          Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung dieser Website, zur Bearbeitung von Anfragen,
          zur Vertragsanbahnung oder aufgrund gesetzlicher Pflichten erforderlich ist. Maßgeblich sind insbesondere Art. 6 Abs. 1 lit. a, b, c und f DSGVO.
        </p>
      </Section>

      <Section title="3. Kontaktformular und Angebotsanfragen">
        <p>
          Wenn Sie das Kontaktformular nutzen, verarbeiten wir die von Ihnen eingegebenen Angaben wie Name, E-Mail-Adresse, Telefonnummer,
          gewünschte Leistung, Flächenangaben und Nachricht. Zweck ist die Bearbeitung Ihrer Anfrage und die Vorbereitung eines Angebots.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, bei allgemeinen Anfragen zusätzlich Art. 6 Abs. 1 lit. f DSGVO.
        </p>
        <p>
          In der aktuellen technischen Umsetzung werden simulierte Anfragen lokal im Browser gespeichert, damit sie im Adminbereich sichtbar sind.
          Wird später ein E-Mail-Versand, CRM-System oder Hosting-Backend angebunden, muss diese Datenschutzerklärung entsprechend ergänzt werden.
        </p>
      </Section>

      <Section title="4. Lokale Speicherung und Cookies">
        <p>
          Diese Website nutzt technisch notwendige lokale Speicherungen, etwa für Admin-Sitzungen, Preis-/Inhaltskonfigurationen,
          gespeicherte Anfragen im Browser und Cookie-Präferenzen. Diese Funktionen sind für die gewünschte Bedienung der Website erforderlich.
        </p>
        <p>
          Optionale Analyse- oder Marketing-Cookies werden nur eingesetzt, wenn Sie vorher ausdrücklich eingewilligt haben.
          Sie können Ihre Auswahl jederzeit ändern.
        </p>
        <button
          onClick={onCookieSettings}
          className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-primary-navy px-4 font-display text-xs font-black uppercase text-white transition hover:bg-slate-950"
        >
          <Cookie size={15} />
          Cookie-Einstellungen öffnen
        </button>
      </Section>

      <Section title="5. Server-Logfiles und Hosting">
        <p>
          Beim Aufruf der Website können technisch notwendige Zugriffsdaten verarbeitet werden, etwa IP-Adresse, Datum und Uhrzeit,
          aufgerufene Datei, übertragene Datenmenge, Browsertyp und Betriebssystem. Die Verarbeitung dient der sicheren und stabilen Bereitstellung der Website
          und erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
        </p>
      </Section>

      <Section title="6. Empfänger und Drittlandübermittlungen">
        <p>
          Eine Weitergabe personenbezogener Daten erfolgt nur, wenn dies für die Bearbeitung Ihrer Anfrage erforderlich ist,
          eine gesetzliche Pflicht besteht oder Sie eingewilligt haben. Bei externen Dienstleistern werden geeignete Auftragsverarbeitungsverträge eingesetzt.
          Drittlandübermittlungen erfolgen nur bei Vorliegen der gesetzlichen Voraussetzungen.
        </p>
      </Section>

      <Section title="7. Speicherdauer">
        <p>
          Personenbezogene Daten werden gelöscht, sobald der jeweilige Zweck entfällt und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
          Anfragen werden regelmäßig überprüft; handels- und steuerrechtlich relevante Unterlagen können bis zu zehn Jahre aufzubewahren sein.
        </p>
      </Section>

      <Section title="8. Ihre Rechte">
        <p>
          Sie haben nach Maßgabe der DSGVO Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit
          sowie Widerspruch gegen bestimmte Verarbeitungen. Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.
        </p>
        <p>
          Außerdem haben Sie das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren, insbesondere in dem Mitgliedstaat Ihres Aufenthaltsorts,
          Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes.
        </p>
      </Section>
    </div>
  );
}

function TermsOfUse({ contact }: { contact: ContactConfig }) {
  return (
    <div>
      <h1 className="font-display text-3xl font-black uppercase tracking-tight text-primary-navy">Nutzungsbedingungen / Terms of Use</h1>
      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">Stand: Juni 2026</p>

      <Section title="1. Geltungsbereich">
        <p>
          Diese Nutzungsbedingungen gelten für die Nutzung der Website von {contact.companyName}. Abweichende Bedingungen von Nutzern finden keine Anwendung,
          soweit wir ihrer Geltung nicht ausdrücklich zustimmen.
        </p>
      </Section>

      <Section title="2. Inhalte der Website">
        <p>
          Die auf dieser Website dargestellten Leistungen, Informationen und Preisbeispiele dienen der allgemeinen Erstinformation.
          Sie ersetzen keine individuelle technische Prüfung vor Ort und kein verbindliches Angebot.
        </p>
      </Section>

      <Section title="3. Angebotsrechner und Simulationen">
        <p>
          Kalkulationen und Richtwerte sind unverbindliche Schätzungen. Maßgeblich für Preis, Umfang, Materialauswahl und Ausführungsfristen
          ist ausschließlich ein schriftliches Angebot nach Prüfung des konkreten Schadensbildes.
        </p>
      </Section>

      <Section title="4. Pflichten der Nutzer">
        <p>
          Nutzer verpflichten sich, keine rechtswidrigen, irreführenden oder fremde Rechte verletzenden Inhalte über Formulare zu übermitteln.
          Manipulationen, automatisierte Angriffe oder Störungen der Website sind untersagt.
        </p>
      </Section>

      <Section title="5. Urheber- und Nutzungsrechte">
        <p>
          Texte, Gestaltung, Bilder, Logos und sonstige Inhalte dieser Website sind urheber- oder kennzeichenrechtlich geschützt.
          Eine Nutzung außerhalb der gesetzlichen Grenzen bedarf unserer vorherigen Zustimmung.
        </p>
      </Section>

      <Section title="6. Haftung">
        <p>
          Wir haften nach den gesetzlichen Vorschriften für Vorsatz und grobe Fahrlässigkeit. Bei einfacher Fahrlässigkeit haften wir nur bei Verletzung
          wesentlicher Vertragspflichten und begrenzt auf den vorhersehbaren, typischen Schaden. Die Haftung für Schäden aus Verletzung von Leben,
          Körper oder Gesundheit bleibt unberührt.
        </p>
      </Section>

      <Section title="7. Schlussbestimmungen">
        <p>
          Es gilt deutsches Recht. Zwingende Verbraucherschutzvorschriften bleiben unberührt. Sollten einzelne Regelungen unwirksam sein,
          bleibt die Wirksamkeit der übrigen Regelungen unberührt.
        </p>
      </Section>
    </div>
  );
}

function Imprint({ contact }: { contact: ContactConfig }) {
  return (
    <div>
      <h1 className="font-display text-3xl font-black uppercase tracking-tight text-primary-navy">AGB / Impressum</h1>
      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">Stand: Juni 2026</p>

      <Section title="Impressum nach § 5 DDG">
        <p>
          {contact.companyName}<br />
          Vertreten durch: {contact.responsiblePerson}<br />
          {contact.streetAddress}<br />
          {contact.postalCity}<br />
          {contact.country}
        </p>
        <p>
          Telefon: {contact.phone}<br />
          E-Mail: {contact.email}
        </p>
        <p>
          Umsatzsteuer / Steuerangaben: {contact.vatId}<br />
          Registerangaben: {contact.registerInfo}<br />
          Kammer / Aufsichtsbehörde: {contact.supervisoryAuthority}
        </p>
      </Section>

      <Section title="Allgemeine Geschäftsbedingungen">
        <p>
          Unsere Angebote richten sich nach dem konkreten Bauzustand, den örtlichen Gegebenheiten und dem vereinbarten Leistungsumfang.
          Ein Vertrag kommt erst durch unsere schriftliche Auftragsbestätigung oder eine beiderseitig bestätigte Vereinbarung zustande.
        </p>
        <p>
          Termine und Ausführungsfristen sind verbindlich, wenn sie ausdrücklich schriftlich bestätigt wurden. Witterung, verdeckte Baumängel,
          fehlende Vorleistungen oder höhere Gewalt können Anpassungen erforderlich machen.
        </p>
        <p>
          Vergütung, Zahlungsplan, Gewährleistung und Abnahme richten sich nach dem jeweiligen Angebot und den gesetzlichen Vorschriften.
          Für Bauleistungen können ergänzend die jeweils ausdrücklich vereinbarten Regelwerke gelten.
        </p>
      </Section>

      <Section title="Verbraucherstreitbeilegung">
        <p>
          Wir sind weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen,
          sofern keine gesetzliche Verpflichtung besteht.
        </p>
      </Section>

      <Section title="Hinweis">
        <p>
          Dieses Impressum enthält professionelle Musterformulierungen, ersetzt aber nicht die Prüfung der konkreten Unternehmensdaten,
          Berufsangaben, Registerdaten und vertraglichen Besonderheiten durch eine qualifizierte Rechtsberatung.
        </p>
      </Section>
    </div>
  );
}
