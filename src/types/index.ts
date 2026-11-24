export type Language = 'en' | 'si';

export interface TimelineItem {
  id: string;
  year: string;
  exactDate?: string;
  titleEn: string;
  titleSi: string;
  descEn: string;
  descSi: string;
  category: 'foundation' | 'academic' | 'leadership' | 'unity' | 'sports';
  icon?: string;
}

export interface CollegeHouse {
  id: string;
  nameEn: string;
  nameSi: string;
  birdEn: string;
  birdSi: string;
  colorNameEn: string;
  colorNameSi: string;
  colorHex: string;
  textColor: string;
  bgClass: string;
  borderClass: string;
  mottoEn: string;
  mottoSi: string;
  points: number;
  descriptionEn: string;
  descriptionSi: string;
}

export interface AcademicStream {
  id: string;
  titleEn: string;
  titleSi: string;
  subjectsEn: string[];
  subjectsSi: string[];
  descriptionEn: string;
  descriptionSi: string;
  deanEn: string;
  icon: string;
}

export interface CollegeEvent {
  id: string;
  type: 'upcoming' | 'past';
  titleEn: string;
  titleSi: string;
  date: string;
  time?: string;
  venue: string;
  category: 'academic' | 'sports' | 'cultural' | 'ceremony';
  descriptionEn: string;
  descriptionSi: string;
  outcomeEn?: string;
  imageUrl?: string;
  createdAt?: string;
}
