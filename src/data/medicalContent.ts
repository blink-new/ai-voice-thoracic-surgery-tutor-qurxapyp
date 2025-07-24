export interface FlashCard {
  id: string
  question: string
  answer: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
}

export interface CaseStudy {
  id: string
  title: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  description: string
  scenario: string
  questions: {
    id: string
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }[]
  learningObjectives: string[]
}

export const flashcards: FlashCard[] = [
  {
    id: 'fc1',
    question: 'What are the absolute contraindications for thoracotomy?',
    answer: 'Absolute contraindications include: severe cardiovascular instability, coagulopathy that cannot be corrected, and patient refusal. Relative contraindications include advanced age, severe comorbidities, and poor functional status.',
    category: 'Emergency Procedures',
    difficulty: 'medium',
    tags: ['thoracotomy', 'contraindications', 'emergency']
  },
  {
    id: 'fc2',
    question: 'Name the key anatomical landmarks for chest tube insertion.',
    answer: 'The safe triangle is bounded by: anterior border of latissimus dorsi, lateral border of pectoralis major, and a line superior to the horizontal level of the nipple. Insert at the 4th or 5th intercostal space.',
    category: 'Emergency Procedures',
    difficulty: 'easy',
    tags: ['chest tube', 'anatomy', 'landmarks']
  },
  {
    id: 'fc3',
    question: 'What is the TNM staging for T3N2M0 lung cancer?',
    answer: 'T3: Tumor >7cm or separate tumor nodules in different ipsilateral lobe. N2: Metastasis to ipsilateral mediastinal/subcarinal lymph nodes. M0: No distant metastasis. This represents Stage IIIA disease.',
    category: 'Lung Cancer Management',
    difficulty: 'hard',
    tags: ['TNM staging', 'lung cancer', 'oncology']
  },
  {
    id: 'fc4',
    question: 'What are the indications for VATS lobectomy?',
    answer: 'VATS lobectomy is indicated for: early-stage NSCLC (T1-T2, N0-N1), benign lesions requiring lobectomy, metastatic disease to lung, and selected cases of inflammatory disease. Contraindications include extensive pleural adhesions, large tumors >6cm, and chest wall invasion.',
    category: 'VATS Techniques',
    difficulty: 'medium',
    tags: ['VATS', 'lobectomy', 'indications']
  },
  {
    id: 'fc5',
    question: 'Describe the management of massive hemothorax.',
    answer: 'Massive hemothorax (>1500ml or >200ml/hr) requires: immediate large-bore chest tube (32-36Fr), aggressive fluid resuscitation, type and crossmatch, urgent thoracotomy if >1500ml initial drainage or >200ml/hr ongoing. Consider autotransfusion if available.',
    category: 'Chest Trauma',
    difficulty: 'hard',
    tags: ['hemothorax', 'trauma', 'emergency']
  },
  {
    id: 'fc6',
    question: 'What are the key components of enhanced recovery after thoracic surgery (ERATS)?',
    answer: 'ERATS includes: preoperative counseling, avoiding prolonged fasting, multimodal analgesia, early mobilization, early chest tube removal, minimally invasive techniques when possible, and standardized discharge criteria.',
    category: 'Post-operative Care',
    difficulty: 'medium',
    tags: ['ERATS', 'recovery', 'postoperative']
  }
]

export const caseStudies: CaseStudy[] = [
  {
    id: 'case1',
    title: 'Emergency Pneumothorax',
    difficulty: 'Intermediate',
    duration: '15 min',
    description: 'A 25-year-old athlete presents with sudden chest pain and shortness of breath',
    scenario: 'A 25-year-old professional basketball player presents to the emergency department with sudden onset of severe right-sided chest pain and shortness of breath that began during practice 2 hours ago. He has no significant medical history and takes no medications. On examination, he appears anxious and is using accessory muscles to breathe. Vital signs: HR 110, BP 130/80, RR 28, O2 sat 92% on room air.',
    questions: [
      {
        id: 'q1',
        question: 'What is the most likely diagnosis based on the presentation?',
        options: [
          'Myocardial infarction',
          'Spontaneous pneumothorax',
          'Pulmonary embolism',
          'Costochondritis'
        ],
        correctAnswer: 1,
        explanation: 'The sudden onset of chest pain and dyspnea in a young, tall, athletic male is classic for spontaneous pneumothorax. This demographic has a higher risk due to subpleural blebs.'
      },
      {
        id: 'q2',
        question: 'What is the next most appropriate diagnostic step?',
        options: [
          'CT chest with contrast',
          'Chest X-ray',
          'ECG',
          'D-dimer'
        ],
        correctAnswer: 1,
        explanation: 'Chest X-ray is the initial imaging of choice for suspected pneumothorax. It can quickly confirm the diagnosis and assess the size of the pneumothorax.'
      },
      {
        id: 'q3',
        question: 'The chest X-ray shows a 40% right-sided pneumothorax. What is the most appropriate management?',
        options: [
          'Observation and oxygen therapy',
          'Needle decompression',
          'Chest tube insertion',
          'Emergency thoracotomy'
        ],
        correctAnswer: 2,
        explanation: 'A 40% pneumothorax in a symptomatic patient requires chest tube insertion. The threshold is typically >20% or any size with symptoms.'
      }
    ],
    learningObjectives: [
      'Recognize the clinical presentation of spontaneous pneumothorax',
      'Understand the appropriate diagnostic workup',
      'Know the indications for different treatment modalities',
      'Understand the risk factors and demographics'
    ]
  },
  {
    id: 'case2',
    title: 'Lung Cancer Staging',
    difficulty: 'Advanced',
    duration: '25 min',
    description: 'Complex case involving T3N2M0 non-small cell lung cancer',
    scenario: 'A 65-year-old male smoker presents with a 3-month history of cough, weight loss, and hemoptysis. CT chest shows a 8cm mass in the right upper lobe with separate nodules in the right lower lobe. Mediastinal lymph nodes are enlarged. PET scan shows uptake in the primary tumor, mediastinal nodes, and no distant metastases. Bronchoscopy confirms adenocarcinoma.',
    questions: [
      {
        id: 'q1',
        question: 'What is the T stage of this tumor?',
        options: ['T1', 'T2', 'T3', 'T4'],
        correctAnswer: 2,
        explanation: 'T3 because the tumor is >7cm and there are separate tumor nodules in a different ipsilateral lobe (right lower lobe nodules with primary in right upper lobe).'
      },
      {
        id: 'q2',
        question: 'Based on enlarged mediastinal nodes on imaging, what is the most likely N stage?',
        options: ['N0', 'N1', 'N2', 'N3'],
        correctAnswer: 2,
        explanation: 'N2 indicates metastasis to ipsilateral mediastinal and/or subcarinal lymph nodes, which matches the imaging findings.'
      },
      {
        id: 'q3',
        question: 'What is the overall stage of this cancer?',
        options: ['Stage IIA', 'Stage IIB', 'Stage IIIA', 'Stage IIIB'],
        correctAnswer: 2,
        explanation: 'T3N2M0 corresponds to Stage IIIA disease according to the 8th edition TNM staging system.'
      }
    ],
    learningObjectives: [
      'Master TNM staging for lung cancer',
      'Understand the 8th edition staging changes',
      'Correlate imaging findings with staging',
      'Know treatment implications of different stages'
    ]
  },
  {
    id: 'case3',
    title: 'Chest Trauma Assessment',
    difficulty: 'Beginner',
    duration: '10 min',
    description: 'Multi-trauma patient with suspected thoracic injuries',
    scenario: 'A 30-year-old male is brought to the trauma bay following a high-speed motor vehicle collision. He is conscious but complains of severe chest pain. Primary survey reveals stable airway, decreased breath sounds on the left, and hemodynamically stable. Chest X-ray shows multiple left-sided rib fractures and a small pneumothorax.',
    questions: [
      {
        id: 'q1',
        question: 'What is the most immediate concern in this patient?',
        options: [
          'Pain management',
          'Pneumothorax progression',
          'Flail chest development',
          'Hemothorax development'
        ],
        correctAnswer: 1,
        explanation: 'In trauma patients, pneumothorax can progress rapidly, especially with positive pressure ventilation. Close monitoring is essential.'
      },
      {
        id: 'q2',
        question: 'What is the threshold for chest tube insertion in traumatic pneumothorax?',
        options: [
          'Any size pneumothorax',
          'Only if >50%',
          'Only if symptomatic',
          'Only if tension develops'
        ],
        correctAnswer: 0,
        explanation: 'In trauma patients, any pneumothorax typically warrants chest tube insertion due to risk of progression and need for positive pressure ventilation.'
      }
    ],
    learningObjectives: [
      'Understand trauma assessment priorities',
      'Know indications for chest tube in trauma',
      'Recognize complications of chest trauma',
      'Understand monitoring requirements'
    ]
  }
]

export const knowledgeAreas = [
  { name: 'Emergency Procedures', topics: ['Pneumothorax', 'Hemothorax', 'Chest Tube', 'Thoracotomy'] },
  { name: 'VATS Techniques', topics: ['Lobectomy', 'Wedge Resection', 'Pleurodesis', 'Biopsy'] },
  { name: 'Lung Cancer Management', topics: ['Staging', 'Surgical Planning', 'Adjuvant Therapy', 'Follow-up'] },
  { name: 'Chest Trauma', topics: ['Assessment', 'Management', 'Complications', 'Recovery'] },
  { name: 'Post-operative Care', topics: ['Pain Management', 'Complications', 'Recovery', 'Discharge'] }
]