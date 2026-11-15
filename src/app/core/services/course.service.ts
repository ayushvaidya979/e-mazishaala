import { Injectable, signal, computed, inject } from '@angular/core';
import { Course } from '../../models/course.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly coursesData: Course[] = [
    {
      id: 'c10-math-mastery',
      title: 'Class 10 Mathematics: Board Toppers Batch 2026-27',
      subtitle: 'Complete Algebra & Geometry syllabus with Chapter-wise PYQs & Mock Tests',
      description: 'Master Class 10th Board Mathematics with conceptual clarity, shortcut techniques, step-by-step theorem proofs, and full solutions for State Board & CBSE curricula in Marathi & English bilingual medium.',
      standard: 10,
      subject: 'Mathematics',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
      instructor: {
        id: 'inst-1',
        name: 'Prof. Rahul Deshmukh',
        title: 'Senior Mathematics Educator (Ex-Vidyapeeth)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        studentsCount: 14200,
        experienceYears: 14,
        bio: 'Trained over 14,000 students across Maharashtra with 250+ students scoring 100/100 in Class 10 Board examinations.'
      },
      startDate: 'Starts Nov 20, 2026',
      price: 2499,
      discountedPrice: 999,
      rating: 4.9,
      reviewCount: 1840,
      lessonsCount: 68,
      duration: '90 Hours',
      language: 'Marathi & English',
      isPopular: true,
      isUpcoming: false,
      isEnrolled: true,
      progressPercent: 68,
      features: [
        '68 Interactive Video Lessons with PDF Notes',
        'Solved Previous 10 Years Board Papers',
        'Weekly Live Doubt Solving Sessions',
        'Unlimited Chapter-wise Quizzes & Worksheets'
      ],
      curriculum: [
        {
          id: 'chap-1',
          title: 'Chapter 1: Linear Equations in Two Variables',
          lessons: [
            { id: 'l1', title: 'Graphical Method & Simultaneous Equations', duration: '45 mins', isFreePreview: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { id: 'l2', title: "Determinant Method (Cramer's Rule)", duration: '40 mins', isFreePreview: false },
            { id: 'l3', title: 'Equations Reducible to Pair of Linear Equations', duration: '50 mins', isFreePreview: false },
            { id: 'l4', title: 'Word Problems on Age, Speed & Numbers', duration: '55 mins', isFreePreview: false }
          ]
        },
        {
          id: 'chap-2',
          title: 'Chapter 2: Quadratic Equations',
          lessons: [
            { id: 'l5', title: 'Factorisation & Formula Method', duration: '48 mins', isFreePreview: true },
            { id: 'l6', title: 'Nature of Roots & Discriminant Analysis', duration: '42 mins', isFreePreview: false },
            { id: 'l7', title: 'Word Problems & Real-World Modeling', duration: '50 mins', isFreePreview: false }
          ]
        },
        {
          id: 'chap-3',
          title: 'Chapter 3: Arithmetic Progression (A.P.)',
          lessons: [
            { id: 'l8', title: 'nth Term of an A.P. Formula Derivation', duration: '45 mins', isFreePreview: false },
            { id: 'l9', title: 'Sum of First n Terms of an A.P.', duration: '52 mins', isFreePreview: false }
          ]
        }
      ]
    },
    {
      id: 'c10-science-booster',
      title: 'Class 10 Science & Tech: Concept & Experiment Masterclass',
      subtitle: 'Complete Science Part 1 & 2 with animated 3D diagrams & lab demonstrations',
      description: 'Comprehensive coverage of Physics, Chemistry, and Biology tailored for Standard 10 board success. Understand complex chemical reactions, gravitation, life processes, and heredity.',
      standard: 10,
      subject: 'Science',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      instructor: {
        id: 'inst-2',
        name: 'Dr. Snehal Patil',
        title: 'M.Sc., Ph.D. in Physics, Gold Medalist',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        rating: 4.95,
        studentsCount: 18500,
        experienceYears: 12,
        bio: 'Specialist in simplifying core Physics and Chemistry through everyday experimental analogies and visual pedagogy.'
      },
      startDate: 'Starts Nov 25, 2026',
      price: 2999,
      discountedPrice: 1199,
      rating: 4.9,
      reviewCount: 2210,
      lessonsCount: 75,
      duration: '110 Hours',
      language: 'Marathi & English',
      isPopular: true,
      isUpcoming: false,
      isEnrolled: true,
      progressPercent: 42,
      features: [
        'Complete Science 1 & 2 Syllabus with 3D Animations',
        'Board Practical & Lab Experiments Breakdown',
        'Model Answer Writing Guidelines',
        'Formula Handbook & Reaction Charts PDF'
      ],
      curriculum: [
        {
          id: 'sci-chap-1',
          title: 'Science Part 1: Gravitation & Laws of Motion',
          lessons: [
            { id: 'sl1', title: "Kepler's Laws & Universal Gravitation", duration: '50 mins', isFreePreview: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { id: 'sl2', title: 'Acceleration Due to Gravity & Free Fall', duration: '45 mins', isFreePreview: false },
            { id: 'sl3', title: 'Escape Velocity & Numerical Problems', duration: '52 mins', isFreePreview: false }
          ]
        },
        {
          id: 'sci-chap-2',
          title: 'Science Part 2: Heredity & Evolution',
          lessons: [
            { id: 'sl4', title: 'Transcription, Translation & Translocation', duration: '44 mins', isFreePreview: false },
            { id: 'sl5', title: 'Evidences of Evolution & Human Evolution', duration: '48 mins', isFreePreview: false }
          ]
        }
      ]
    },
    {
      id: 'c9-math-foundation',
      title: 'Standard 9: Mathematics Foundation & Concept Builder',
      subtitle: 'Build strong fundamentals for 10th Boards in Geometry, Polynomials & Circles',
      description: 'Strengthen your core analytical foundation in Standard 9 Mathematics. Specially designed to ease transitions into high school geometry, coordinate geometry, and statistics.',
      standard: 9,
      subject: 'Mathematics',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
      instructor: {
        id: 'inst-1',
        name: 'Prof. Rahul Deshmukh',
        title: 'Senior Mathematics Educator',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 4.88,
        studentsCount: 9600,
        experienceYears: 14,
        bio: 'Expert in developing mathematical intuition in middle and high school students.'
      },
      startDate: 'Starts Dec 01, 2026',
      price: 1999,
      discountedPrice: 799,
      rating: 4.8,
      reviewCount: 920,
      lessonsCount: 52,
      duration: '72 Hours',
      language: 'Marathi & English',
      isPopular: false,
      isUpcoming: true,
      isEnrolled: false,
      features: [
        'Step-by-step theorem derivations and geometric proofs',
        'Daily practice worksheets with video hints',
        'Exam-focused short question sets'
      ],
      curriculum: [
        {
          id: 'm9-c1',
          title: 'Unit 1: Sets & Real Numbers',
          lessons: [
            { id: 'm9-l1', title: 'Set Operations & Venn Diagrams', duration: '40 mins', isFreePreview: true },
            { id: 'm9-l2', title: 'Surds and Operations on Surds', duration: '45 mins', isFreePreview: false }
          ]
        }
      ]
    },
    {
      id: 'c8-marathi-sanskritik',
      title: 'इयत्ता ८ वी: सुलभभारती संपूर्ण मराठी व व्याकरण विशेष बॅच',
      subtitle: 'गद्य, पद्य, भावार्थ, निबंध व समग्र व्याकरण सहज सोप्या भाषेत',
      description: 'इयत्ता ८ वी च्या विद्यार्थ्यांसाठी मराठी सुलभभारती अभ्यासक्रम, व्याकरण, पत्रलेखन, निबंधलेखन आणि कवितांचे रसग्रहण मराठी शिक्षकांकडून अतिशय सुंदर पद्धतीने शिकवले जाते.',
      standard: 8,
      subject: 'Marathi',
      thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      instructor: {
        id: 'inst-3',
        name: 'Mrs. Anjali Kulkarni',
        title: 'State Awardee Marathi Littérateur & Educator',
        avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=200&q=80',
        rating: 4.96,
        studentsCount: 11200,
        experienceYears: 18,
        bio: 'Recipient of Maharashtra State Adarsh Shikshak Puraskar, passionate about Marathi literature and grammar.'
      },
      startDate: 'Starts Nov 22, 2026',
      price: 1499,
      discountedPrice: 599,
      rating: 4.9,
      reviewCount: 1140,
      lessonsCount: 45,
      duration: '55 Hours',
      language: 'मराठी (Marathi)',
      isPopular: true,
      isUpcoming: false,
      isEnrolled: false,
      features: [
        'सर्व धडे व कवितांचा सविस्तर भावार्थ',
        'संपूर्ण मराठी व्याकरण (नाम, सर्वनाम, समास, अलंकार)',
        'उपयोजित लेखन (निबंध, पत्र, बातमी लेखन)',
        'सराव प्रश्नपत्रिका व आदर्श उत्तरे'
      ],
      curriculum: [
        {
          id: 'mar-c1',
          title: 'भाग १: गद्य व पद्य रसग्रहण',
          lessons: [
            { id: 'ml1', title: 'धडा १: भारत देश महान (गीत गायन व भावार्थ)', duration: '35 mins', isFreePreview: true },
            { id: 'ml2', title: 'धडा २: मी चित्रकार कसा झालो!', duration: '42 mins', isFreePreview: false }
          ]
        }
      ]
    },
    {
      id: 'c7-english-fluency',
      title: 'Standard 7: English Grammar, Writing & Spoken Fluency',
      subtitle: 'Score full marks in school exams & speak English with natural confidence',
      description: 'Complete syllabus coverage for Standard 7 English textbook along with foundational grammar, vocabulary building, comprehension techniques, and daily conversation practice.',
      standard: 7,
      subject: 'English',
      thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      instructor: {
        id: 'inst-4',
        name: 'Mr. Sachin Shinde',
        title: 'Cambridge Certified ELT Trainer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 4.87,
        studentsCount: 7800,
        experienceYears: 10,
        bio: 'Trained over 7,000 school students in communicative grammar, phonetic reading, and creative storytelling.'
      },
      startDate: 'Starts Dec 05, 2026',
      price: 1699,
      discountedPrice: 699,
      rating: 4.8,
      reviewCount: 740,
      lessonsCount: 48,
      duration: '60 Hours',
      language: 'English & Marathi',
      isPopular: false,
      isUpcoming: true,
      isEnrolled: false,
      features: [
        'Grammar Made Fun: Interactive quiz-based learning',
        'Story Analysis & Question-Answer Drill',
        'Formal and Informal Letter Writing Templates',
        'Daily 10-Minute Vocabulary Flashcards'
      ],
      curriculum: [
        {
          id: 'eng-c1',
          title: 'Module 1: Tenses and Active-Passive Voice',
          lessons: [
            { id: 'el1', title: 'Mastering the 12 Tenses with Story Examples', duration: '40 mins', isFreePreview: true },
            { id: 'el2', title: 'Direct and Indirect Speech Simplified', duration: '45 mins', isFreePreview: false }
          ]
        }
      ]
    },
    {
      id: 'c6-science-experiments',
      title: 'Standard 6: Young Explorer Science & Discovery Club',
      subtitle: 'Hands-on simple science experiments, universe discoveries & natural wonders',
      description: 'Inspire scientific curiosity in 6th graders. From plant life to celestial movements, simple machines, and electricity basics through colorful visuals and relatable real-life analogies.',
      standard: 6,
      subject: 'Science',
      thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
      instructor: {
        id: 'inst-2',
        name: 'Dr. Snehal Patil',
        title: 'M.Sc., Ph.D. in Physics',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        rating: 4.93,
        studentsCount: 8900,
        experienceYears: 12,
        bio: 'Believer in hands-on science learning over rote memorization.'
      },
      startDate: 'Starts Nov 28, 2026',
      price: 1499,
      discountedPrice: 599,
      rating: 4.9,
      reviewCount: 830,
      lessonsCount: 40,
      duration: '50 Hours',
      language: 'Marathi & English',
      isPopular: false,
      isUpcoming: true,
      isEnrolled: false,
      features: [
        'Kitchen science experiments children can try safely',
        'Diagram drawing made easy with step-by-step videos',
        'Printable colorful revision flashcards'
      ],
      curriculum: [
        {
          id: 'sci6-c1',
          title: 'Natural Resources - Air, Water and Land',
          lessons: [
            { id: 'sl6-1', title: 'Atmosphere Layers & Importance of Ozone', duration: '35 mins', isFreePreview: true },
            { id: 'sl6-2', title: 'Water Scarcity & Conservation Techniques', duration: '38 mins', isFreePreview: false }
          ]
        }
      ]
    },
    {
      id: 'c5-all-subjects',
      title: 'Standard 5: Comprehensive All-in-One Scholar Batch',
      subtitle: 'Math, EVS, English & Marathi complete foundation for Primary to Middle School',
      description: 'Specially created for 5th Standard students transitioning to upper primary schooling. Covers all four major subjects with friendly visual storytelling, mental maths drills, and weekly assessments.',
      standard: 5,
      subject: 'Social Science',
      thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
      instructor: {
        id: 'inst-5',
        name: 'Mrs. Radhika Joshi',
        title: 'Primary Education Specialist (B.Ed., M.A.)',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        rating: 4.91,
        studentsCount: 6500,
        experienceYears: 11,
        bio: 'Dedicated primary educator specializing in child cognitive development and fun activity-based learning.'
      },
      startDate: 'Starts Nov 18, 2026',
      price: 2199,
      discountedPrice: 899,
      rating: 4.9,
      reviewCount: 620,
      lessonsCount: 60,
      duration: '80 Hours',
      language: 'Marathi & English',
      isPopular: true,
      isUpcoming: false,
      isEnrolled: false,
      features: [
        'Complete coverage of 4 primary school subjects',
        'Animated storytelling and interactive quizzes',
        'Parent weekly progress report card'
      ],
      curriculum: [
        {
          id: 'std5-c1',
          title: 'Mathematics & Environmental Studies',
          lessons: [
            { id: 'std5-l1', title: 'Roman Numerals & Number Work', duration: '30 mins', isFreePreview: true },
            { id: 'std5-l2', title: 'Our Earth and Our Solar System', duration: '35 mins', isFreePreview: false }
          ]
        }
      ]
    },
    {
      id: 'c1-4-junior-starters',
      title: 'Junior Shaala (Std 1–4): Activity & Phonics Smart Learning',
      subtitle: 'Early reading, mental arithmetic, nature studies & value education',
      description: 'Engaging, colorful, sound-rich interactive lessons for young learners from Standard 1 to 4. Develops reading habits, phonics, basic addition/subtraction, and general awareness.',
      standard: 3,
      subject: 'Mathematics',
      thumbnail: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
      instructor: {
        id: 'inst-5',
        name: 'Mrs. Radhika Joshi',
        title: 'Primary Education Specialist',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        rating: 4.95,
        studentsCount: 15400,
        experienceYears: 11,
        bio: 'Creates engaging early childhood curricula trusted by thousands of schools.'
      },
      startDate: 'Starts Ongoing',
      price: 1299,
      discountedPrice: 499,
      rating: 4.9,
      reviewCount: 1540,
      lessonsCount: 50,
      duration: '40 Hours',
      language: 'Marathi & English',
      isPopular: true,
      isUpcoming: false,
      isEnrolled: true,
      progressPercent: 85,
      features: [
        'Colorful animated songs & rhymes',
        'Multiplication tables tricks and mental math',
        'Moral stories with audio narration'
      ],
      curriculum: [
        {
          id: 'j-c1',
          title: 'Numbers and Everyday Science',
          lessons: [
            { id: 'jl1', title: 'Introduction to 3-Digit Numbers with Visual Blocks', duration: '25 mins', isFreePreview: true },
            { id: 'jl2', title: 'Plants around Us: Roots, Stems & Leaves', duration: '28 mins', isFreePreview: false }
          ]
        }
      ]
    }
  ];

  private supabaseService = inject(SupabaseService);
  private readonly supabase = this.supabaseService.supabase;

  // State signals
  private coursesSignal = signal<Course[]>(this.coursesData);
  private selectedStandardSignal = signal<number | null>(null);
  private searchQuerySignal = signal<string>('');

  readonly courses = this.coursesSignal.asReadonly();
  readonly selectedStandard = this.selectedStandardSignal.asReadonly();
  readonly searchQuery = this.searchQuerySignal.asReadonly();

  constructor() {
    this.loadCoursesFromSupabase();
    this.initRealtimeSubscription();
  }

  private initRealtimeSubscription() {
    try {
      this.supabase
        .channel('user-batches-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'batches' }, () => {
          this.loadCoursesFromSupabase();
        })
        .subscribe();
    } catch {}
  }

  private async loadCoursesFromSupabase() {
    try {
      // 1. Fetch courses
      const { data: dbCourses } = await this.supabase
        .from('courses')
        .select('*');

      // 2. Fetch academic batches managed in Admin Portal
      const { data: dbBatches } = await this.supabase
        .from('batches')
        .select('*');

      let combined: Course[] = [];

      if (dbCourses && dbCourses.length > 0) {
        const mapped: Course[] = dbCourses.map(db => {
          const existing = this.coursesData.find(c => c.id === db.id);
          return {
            id: db.id,
            title: db.title,
            subtitle: db.subtitle || existing?.subtitle || '',
            description: db.description || existing?.description || '',
            standard: db.standard,
            subject: db.subject,
            thumbnail: db.thumbnail || existing?.thumbnail || '',
            instructor: {
              id: 'inst-' + db.id,
              name: db.instructor_name,
              title: db.instructor_title || existing?.instructor.title || '',
              avatar: db.instructor_avatar || existing?.instructor.avatar || '',
              rating: Number(db.instructor_rating) || 4.9,
              studentsCount: db.instructor_students_count || 10000,
              experienceYears: db.instructor_experience_years || 10,
              bio: db.instructor_bio || existing?.instructor.bio || ''
            },
            startDate: db.start_date || existing?.startDate || '',
            price: Number(db.price) || 0,
            discountedPrice: Number(db.discounted_price) || 0,
            rating: Number(db.rating) || 4.9,
            reviewCount: db.review_count || 100,
            lessonsCount: db.lessons_count || 50,
            duration: db.duration || '80 Hours',
            language: db.language || 'Marathi & English',
            isPopular: db.is_popular,
            isUpcoming: db.is_upcoming,
            isEnrolled: existing?.isEnrolled || false,
            progressPercent: existing?.progressPercent || 0,
            features: (db.features as string[]) || existing?.features || [],
            curriculum: existing?.curriculum || []
          };
        });
        combined = [...mapped];
      }

      if (dbBatches && dbBatches.length > 0) {
        const batchMapped: Course[] = dbBatches.map(b => {
          const existing = this.coursesData.find(c => c.id === b.id);
          return {
            id: b.id,
            title: b.name,
            subtitle: b.course_name,
            description: b.description || b.name,
            standard: 10,
            subject: b.course_name || 'General',
            thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
            instructor: {
              id: 'inst-' + b.id,
              name: 'Prof. Rahul Deshmukh & Faculty',
              title: 'Senior Educator',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
              rating: 4.9,
              studentsCount: b.total_seats || 100,
              experienceYears: 12,
              bio: 'Senior Faculty at e-MaziShaala'
            },
            startDate: `Starts ${b.start_date}`,
            price: Number(b.price) || 999,
            discountedPrice: Number(b.price) || 999,
            rating: 4.9,
            reviewCount: 120,
            lessonsCount: 60,
            duration: '80 Hours',
            language: 'Marathi & English',
            isPopular: b.is_featured ?? false,
            isUpcoming: b.status === 'Upcoming' || b.status === 'Registration Open',
            isEnrolled: false,
            progressPercent: 0,
            features: [
              `Total Capacity: ${b.total_seats} seats (${b.available_seats} remaining)`,
              `Status: ${b.status}`,
              `Schedule: ${b.start_date} to ${b.end_date}`,
              'Live Doubt Clearing & Test Series'
            ],
            curriculum: existing?.curriculum || []
          };
        });

        for (const bm of batchMapped) {
          if (!combined.find(c => c.id === bm.id)) {
            combined.push(bm);
          }
        }
      }

      if (combined.length > 0) {
        const merged = [...combined];
        for (const local of this.coursesData) {
          if (!merged.find(m => m.id === local.id)) {
            merged.push(local);
          }
        }
        this.coursesSignal.set(merged);
      }
    } catch {
      // Offline fallback to coursesData
    }
  }

  // Filtered courses
  readonly filteredCourses = computed(() => {
    let list = this.coursesSignal();
    const std = this.selectedStandardSignal();
    const query = this.searchQuerySignal().trim().toLowerCase();

    if (std !== null) {
      list = list.filter(c => c.standard === std);
    }

    if (query) {
      list = list.filter(c =>
        c.title.toLowerCase().includes(query) ||
        c.subject.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.instructor.name.toLowerCase().includes(query)
      );
    }

    return list;
  });

  readonly popularCourses = computed(() =>
    this.coursesSignal().filter(c => c.isPopular)
  );

  readonly upcomingCourses = computed(() =>
    this.coursesSignal().filter(c => c.isUpcoming)
  );

  readonly enrolledCourses = computed(() =>
    this.coursesSignal().filter(c => c.isEnrolled)
  );

  setStandardFilter(std: number | null) {
    this.selectedStandardSignal.set(std);
  }

  setSearchQuery(q: string) {
    this.searchQuerySignal.set(q);
  }

  getCourseById(id: string): Course | undefined {
    return this.coursesSignal().find(c => c.id === id);
  }

  async enrollInCourse(courseId: string) {
    this.coursesSignal.update(courses =>
      courses.map(c => {
        if (c.id === courseId) {
          return { ...c, isEnrolled: true, progressPercent: 0 };
        }
        return c;
      })
    );

    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      if (session?.user?.id) {
        await this.supabase
          .from('enrollments')
          .upsert({
            user_id: session.user.id,
            course_id: courseId,
            progress_percent: 0,
            completed_lessons: 0
          }, { onConflict: 'user_id,course_id' });
      }
    } catch (e) {
      console.warn('Could not save enrollment to Supabase:', e);
    }
  }
}

