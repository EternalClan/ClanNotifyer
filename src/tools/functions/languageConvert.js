/* eslint-disable no-console */
/* eslint-disable max-len */
// eslint-disable-next-line no-unused-expressions
require("dotenv").config;

class LanguageConvert {
	static code(code) {
		return new Promise((resolve, reject) => {
			try {
				let langCode = "";
				if (code === "pt-BR" || code === "pt_BR") langCode = "Brazilian Portuguese / Português Brasileiro";
				if (code === "bg" || code === "gb_BG") langCode = "Bulgarian / български";
				if (code === "zh-CN" || code === "zh_CN") langCode = "Chinese / 现代标准汉语";
				if (code === "hr" || code === "hr_HR") langCode = "Croatian / Hrvatski";
				if (code === "cs" || code === "cs_CZ") langCode = "Czech / čeština";
				if (code === "da" || code === "da_DK") langCode = "Danish / Dansk";
				if (code === "nl" || code === "nl_NL") langCode = "Dutch / Nederlands";
				if (code === "en-GB" || code === "en_GB") langCode = "English, UK";
				if (code === "en-US" || code === "en_US") langCode = "English, US";
				if (code === "fi" || code === "fi_FI") langCode = "Finnish / Suomi";
				if (code === "fr" || code === "fr_FR") langCode = "French / Français";
				if (code === "de" || code === "de_DE") langCode = "German / Deutsch";
				if (code === "de_CH") langCode = "Swiss German / Schwiizerdütsch";
				if (code === "de_AT") langCode = "Austrian / Österreichisch";
				if (code === "el" || code === "el_GR") langCode = "Greek / Ελληνικά";
				if (code === "hi" || code === "hi_IN") langCode = "Hindi / हिंदी";
				if (code === "hu" || code === "hu_HU") langCode = "Hungarian / Magyar Nyelv";
				if (code === "id" || code === "id_ID") langCode = "Indonesian / Bahasa Indonesia";
				if (code === "it" || code === "it_IT") langCode = "Italian / Italiano";
				if (code === "ja" || code === "ja_JP") langCode = "Japanese / 日本語";
				if (code === "lt" || code === "lt_LT") langCode = "Lithuanian / Lietuvių Kalba";
				if (code === "no" || code === "no_NO") langCode = "Norwegian / Norsk";
				if (code === "pl" || code === "pl_PL") langCode = "Polish / Polski";
				if (code === "ro" || code === "ro_RO") langCode = "Romanian / limba română";
				if (code === "ru" || code === "ru_RU") langCode = "Russian / Pусский язык";
				if (code === "ko" || code === "ko_KR" || code === "ko_KP") langCode = "Korean / 한국어";
				if (code === "es-ES" || code === "es_ES") langCode = "Spanish / Español*a";
				if (code === "sv-SE" || code === "sv_SE") langCode = "Swedish / Svenska";
				if (code === "zh-TW" || code === "zh_TW") langCode = "Taiwan / 臺語";
				if (code === "th" || code === "th_TH") langCode = "Thai / ภาษาไทย";
				if (code === "tr" || code === "tr_TR") langCode = "Turkish / Türkçe";
				if (code === "uk" || code === "uk_UA") langCode = "Ukrainian / Yкраї́нська мо́ва";
				if (code === "vi" || code === "vi_VN") langCode = "Vietnamese / Tiếng Việt";
				const langNew = langCode;
				resolve(langNew || "");
			} catch (err) {
				reject(err);
			}
		});
	}

	/**
	 *
	 * @param text
	 * @param values
	 * @returns
	 */
	static lang(text, ...values) {
		let lang = text;
		values.forEach(value => {
			lang = lang.replace("$s", `${value}`);
		});
		const language = lang;
		return language;
	}
}

exports.LanguageConvert = LanguageConvert;

/**
    1   id     Indonesian             Bahasa Indonesia     :
    2   da     Danish                 Dansk                :
    3   de     German                 Deutsch              :
    4   en-GB  English, UK            English, UK          :
    5   en-US  English, US            English, US          :
    6   es-ES  Spanish                Español              :
    7   fr     French                 Français             :
    8   hr     Croatian               Hrvatski             :
    9   it     Italian                Italiano             :
    10  lt     Lithuanian             Lietuviškai          :
    11  hu     Hungarian              Magyar               :
    12  nl     Dutch                  Nederlands           :
    13  no     Norwegian              Norsk                :
    14  pl     Polish                 Polski               :
    15  pt-BR  Portuguese, Brazilian  Português do Brasil  :
    16  ro     Romanian, Romania      Română               :
    17  fi     Finnish                Suomi                :
    18  sv-SE  Swedish                Svenska              :
    19  vi     Vietnamese             Tiếng Việt           :
    20  tr     Turkish                Türkçe               :
    21  cs     Czech                  Čeština              :
    22  el     Greek                  Ελληνικά             :
    23  bg     Bulgarian              български            :
    24  ru     Russian                Pусский              :
    25  uk     Ukrainian              Українська           :
    26  hi     Hindi                  हिन्दी                  :
    27  th     Thai                   ไทย                  :
    28  zh-CN  Chinese, China         中文                 :
    29  ja     Japanese               日本語               :
    30  zh-TW  Chinese, Taiwan        繁體中文             :
    31  ko     Korean                 한국어               :
 */
