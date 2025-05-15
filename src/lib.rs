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

#[derive(Clone, Debug)]
pub struct Scripture {
    reference : String,
    text : String,
    link : String,
}


#[wasm_bindgen]
#[derive(Debug)]
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
        let bom = Gospel::convert_json_chapters(&bom_json);
        let ot = Gospel::convert_json_chapters(&ot_json);
        let nt = Gospel::convert_json_chapters(&nt_json);
        let dc = Gospel::convert_json_sections(&dc_json);
        let pogp = Gospel::convert_json_chapters(&pogp_json);   
        Gospel { bom, ot, nt, dc, pogp }     
    }

    // pub fn scriptures(&self) -> js_sys::Array {
    //     let array = js_sys::Array::new();
    //     for scripture in self.scriptures.iter() {
    //         array.push(&JsValue::from(&scripture.text));
    //     }
    //     array
    // }

    pub fn search(&mut self, text : String, bom : bool, ot : bool, nt : bool, dc : bool, pogp : bool, word : bool, case : bool) -> Vec<String> {
        let mut results : Vec<String> = Vec::new();
        if text.is_empty() {
            return results
        }

        let case_tag = match case {
            false => "(?i)",
            true => ""
        };
        let re = match word {
            true => Regex::new(format!("({}\\b{}\\b)",case_tag,text).as_str()).unwrap(),
            false => Regex::new(format!("({}{})",case_tag,text).as_str()).unwrap()
        };
    
        if bom {
           for scripture in self.bom.iter() {
                if re.is_match(&scripture.text) {
                    // let escaped_text = regex::escape(&scripture.text);
                    let tagged_text = re.replace_all(&scripture.text, "<span style=\"color: red;\">$1</span>");
                    let formatted_text = format!("<b><a href=\"{}\" target=\"_blank\" rel=\"noopener noreferrer\">{}</a></b> - {}", scripture.link, scripture.reference, tagged_text);
                    results.push(formatted_text);
                }
            }
        }
        if ot {
           for scripture in self.ot.iter() {
                if re.is_match(&scripture.text) {
                    // let escaped_text = regex::escape(&scripture.text);
                    let tagged_text = re.replace_all(&scripture.text, "<span style=\"color: red;\">$1</span>");
                    let formatted_text = format!("<b><a href=\"{}\" target=\"_blank\" rel=\"noopener noreferrer\">{}</a></b> - {}", scripture.link, scripture.reference, tagged_text);
                    results.push(formatted_text);
                }
            }
        }
        if nt {
           for scripture in self.nt.iter() {
                if re.is_match(&scripture.text) {
                    // let escaped_text = regex::escape(&scripture.text);
                    let tagged_text = re.replace_all(&scripture.text, "<span style=\"color: red;\">$1</span>");
                    let formatted_text = format!("<b><a href=\"{}\" target=\"_blank\" rel=\"noopener noreferrer\">{}</a></b> - {}", scripture.link, scripture.reference, tagged_text);
                    results.push(formatted_text);
                }
            }
        }
        if dc {
           for scripture in self.dc.iter() {
                if re.is_match(&scripture.text) {
                    // let escaped_text = regex::escape(&scripture.text);
                    let tagged_text = re.replace_all(&scripture.text, "<span style=\"color: red;\">$1</span>");
                    let formatted_text = format!("<b><a href=\"{}\" target=\"_blank\" rel=\"noopener noreferrer\">{}</a></b> - {}", scripture.link, scripture.reference, tagged_text);
                    results.push(formatted_text);
                }
            }
        }
        if pogp {
           for scripture in self.pogp.iter() {
                if re.is_match(&scripture.text) {
                    // let escaped_text = regex::escape(&scripture.text);
                    let tagged_text = re.replace_all(&scripture.text, "<span style=\"color: red;\">$1</span>");
                    let formatted_text = format!("<b><a href=\"{}\" target=\"_blank\" rel=\"noopener noreferrer\">{}</a></b> - {}", scripture.link, scripture.reference, tagged_text);
                    results.push(formatted_text);
                }
            }
        }
        results
    }

    fn convert_json_chapters(json : &str) -> Vec<Scripture> {
        let mut result : Vec<Scripture> = Vec::new();
        if let Ok(volume_chapters) = serde_json::from_str::<VolumeChapters>(json) {
        
            for book in volume_chapters.books {
                for chapter in book.chapters {
                    for verse in chapter.verses {
                        // https://www.churchofjesuschrist.org/study/scriptures/ot/gen/12?lang=eng&id=p1#p1
                        let link = format!("https://www.churchofjesuschrist.org/study/scriptures/{}/{}/{}?id=p{}#p{}",
                            volume_chapters.lds_slug, book.lds_slug, chapter.chapter, verse.verse, verse.verse);
                        let scripture = Scripture { reference: verse.reference, text: verse.text, link };
                        result.push(scripture);
                    }
                }
            }
        }
        result
    }

    fn convert_json_sections(json : &str) -> Vec<Scripture> {
        let mut result : Vec<Scripture> = Vec::new();
        if let Ok(volume_sections) = serde_json::from_str::<VolumeSections>(json) {
        
            for section in volume_sections.sections {
                for verse in section.verses {
                    // https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/132?lang=eng&id=p16#p16
                    let link = format!("https://www.churchofjesuschrist.org/study/scriptures/{}/{}?id=p{}#p{}",
                            volume_sections.lds_slug, section.section, verse.verse, verse.verse);
                    let scripture = Scripture { reference: verse.reference, text: verse.text, link };
                    result.push(scripture);
                }
            }
        }
        result
    }

    
}

