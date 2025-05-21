use regex::Regex;
use wasm_bindgen::prelude::*;
use serde::Deserialize;

#[derive(Deserialize)]
struct VolumeChapters {
    books : Vec<Book>,
    lds_slug : String,
}

#[derive(Deserialize)]
struct VolumeSections {
    sections : Vec<Section>,
    lds_slug : String,
}

#[derive(Deserialize)]
struct Section {
    verses : Vec<Verse>,
    section : u8,
}

#[derive(Deserialize)]
struct Book {
    chapters : Vec<Chapter>,
    lds_slug : String,
}

#[derive(Deserialize)]
struct Chapter {
    verses : Vec<Verse>,
    chapter : u8,
}

#[derive(Deserialize)]
struct Verse {
    reference : String,
    text : String,
    verse : u8,
}

struct Scripture {
    text : String,
    reference : String,
    link : String,
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct SearchParams {
    pub bom : bool,
    pub ot : bool,
    pub nt : bool,
    pub dc : bool,
    pub pogp : bool,
    pub word : bool,
    pub case : bool,
}

#[wasm_bindgen]
impl SearchParams {
    #[wasm_bindgen(constructor)]
    pub fn new() -> SearchParams {
        SearchParams { bom: true, ot: true, nt: true, dc: true, pogp: true, word: false, case: false }
    }

    #[wasm_bindgen]
    pub fn copy(&self) -> SearchParams {
        self.clone()
    }

}

impl Default for SearchParams {
    fn default() -> Self {
        Self::new()
    }
}


#[wasm_bindgen]
pub struct Gospel {
    bom : Vec<Scripture>,
    ot : Vec<Scripture>,
    nt : Vec<Scripture>,
    dc : Vec<Scripture>,
    pogp : Vec<Scripture>,
}

#[wasm_bindgen]
impl Gospel {
    #[wasm_bindgen(constructor)]
    pub fn new(bom_json : String, dc_json : String, nt_json : String, ot_json : String, pogp_json : String) -> Self {
        let bom = Gospel::load_volume_chapters(&bom_json);
        let ot = Gospel::load_volume_chapters(&ot_json);
        let nt = Gospel::load_volume_chapters(&nt_json);
        let dc = Gospel::load_volume_sections(&dc_json);
        let pogp = Gospel::load_volume_chapters(&pogp_json);  
        Gospel { bom, ot, nt, dc, pogp }     
    }

    pub async fn search_async(&self, text : &str, params : &SearchParams) -> JsValue {
        let result = self.search(text, params);
        serde_wasm_bindgen::to_value(&result).unwrap()
    }

    pub fn search(&self, text : &str, params : &SearchParams) -> Vec<String> {
        if text.is_empty() {
            return Vec::<String>::new();
        }
        let case_tag = match params.case {
            false => "(?i)",
            true => ""
        };
        let re = match params.word {
            true => Regex::new(format!("({}\\b{}\\b)",case_tag,text).as_str()).unwrap(),
            false => Regex::new(format!("({}{})",case_tag,text).as_str()).unwrap()
        };
        let mut results = Vec::new();
        if params.bom { 
            Gospel::search_volume(&re, &self.bom, &mut results);
        }
        if params.ot { 
            Gospel::search_volume(&re, &self.ot, &mut results);
        }
        if params.nt { 
            Gospel::search_volume(&re, &self.nt, &mut results);
        }
        if params.dc { 
            Gospel::search_volume(&re, &self.dc, &mut results);
        }
        if params.pogp { 
            Gospel::search_volume(&re, &self.pogp, &mut results);
        }

        results

    }

    fn search_volume(re : &Regex, volume : &[Scripture], results : &mut Vec<String>) {
        for scripture in volume {
            if re.is_match(&scripture.text) {
                let tagged_text = re.replace_all(&scripture.text, "<span style=\"color: red;\">$1</span>");
                let formatted_text = format!("<b><a href=\"{}\" target=\"_blank\" rel=\"noopener noreferrer\">{}</a></b> - {}", 
                    scripture.link, scripture.reference, tagged_text);
                results.push(formatted_text);
            }
        }
    }

    fn load_volume_chapters(json : &str) -> Vec<Scripture> {
        let mut results = Vec::new();
        let volume = match serde_json::from_str::<VolumeChapters>(json) {
            Ok(volume) => volume,
            Err(_) => return results
        };
        for book in volume.books.iter() {
            for chapter in book.chapters.iter() {
                for verse in chapter.verses.iter() {
                    let text = verse.text.clone();
                    let reference = verse.reference.clone();
                    let link = format!("https://www.churchofjesuschrist.org/study/scriptures/{}/{}/{}?id=p{}#p{}",
                             volume.lds_slug, book.lds_slug, chapter.chapter, verse.verse, verse.verse);
                    results.push(Scripture { text, reference, link });
                }
            }
        }
        results
    }

    fn load_volume_sections(json : &str) -> Vec<Scripture> {
        let mut results = Vec::new();
        let volume = match serde_json::from_str::<VolumeSections>(json) {
            Ok(volume) => volume,
            Err(_) => return results
        };
        for section in volume.sections.iter() {
            for verse in section.verses.iter() {
                let text = verse.text.clone();
                let reference = verse.reference.clone();
                let link = format!("https://www.churchofjesuschrist.org/study/scriptures/{}/{}?id=p{}#p{}",
                            volume.lds_slug, section.section, verse.verse, verse.verse);
                results.push(Scripture { text, reference, link });
            }
        }
        results
    }


    
}
