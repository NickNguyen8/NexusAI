
import { AIApp, AppType, Language } from './types';

export const TRANSLATIONS = {
  en: {
    sidebar: {
      workspace: "Workspace",
      library: "App Library",
      create: "Create App",
      history: "Recent Chats",
      noHistory: "No recent history",
      upgrade: "Upgrade Plan",
      settings: "Settings",
      logout: "Log out",
      login: "Log in",
      plan: "Plan",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      language: "Language",
    },
    library: {
      title: "AIHub Store",
      subtitle: "Install intelligent agents to your sidebar or build custom workflows connected to your data.",
      searchPlaceholder: "Search for agents...",
      searchResults: "Search results for",
      recommended: "Recommended for you",
      createCardTitle: "Create Agent",
      createCardDesc: "Design a new assistant with custom prompts and backend tools.",
      installed: "Installed",
      launch: "Launch App",
      noResults: "No agents found matching",
      createModalTitle: "Create New Agent",
      labelName: "Agent Name",
      labelDesc: "Description",
      labelInstr: "System Instructions",
      btnCancel: "Cancel",
      btnCreate: "Create Agent",
      placeholderName: "e.g. Travel Planner",
      placeholderDesc: "Briefly describe what it does",
      placeholderInstr: "You are an expert travel agent..."
    },
    chat: {
      inputPlaceholder: "Message",
      disclaimer: "AIHub can make mistakes. Check important info.",
      emptyState: "How can I help you today?"
    },
    auth: {
      welcome: "Welcome to AIHub",
      subtitle: "Sign in to save your chat history, create custom agents, and upgrade your plan.",
      google: "Continue with Google",
      apple: "Continue with Apple",
      microsoft: "Continue with Microsoft",
      agreement: "By continuing, you agree to our Terms of Service and Privacy Policy.",
      loading: "Signing in...",
      success: "Success!"
    },
    upgrade: {
      title: "Upgrade your plan",
      subtitle: "Choose the perfect plan for your needs. Cancel anytime.",
      current: "Current Plan",
      contact: "Contact Sales",
      popular: "POPULAR",
      payo: "Pay As You Go",
      payoDesc: "Flexible token-based pricing. No monthly commitment.",
      amount: "Amount",
      estTokens: "Est. Tokens",
      generate: "Generate QR",
      scan: "Scan to pay",
      footer: "Prices are in USD. Local taxes may apply.",
      upgradeBtn: "Upgrade to Pro"
    }
  },
  vi: {
    sidebar: {
      workspace: "Không gian làm việc",
      library: "Kho ứng dụng",
      create: "Tạo ứng dụng",
      history: "Lịch sử trò chuyện",
      noHistory: "Không có lịch sử",
      upgrade: "Nâng cấp gói",
      settings: "Cài đặt",
      logout: "Đăng xuất",
      login: "Đăng nhập",
      plan: "Gói",
      darkMode: "Giao diện tối",
      lightMode: "Giao diện sáng",
      language: "Ngôn ngữ",
    },
    library: {
      title: "Cửa hàng AIHub",
      subtitle: "Cài đặt các trợ lý thông minh vào thanh bên hoặc xây dựng quy trình làm việc tùy chỉnh.",
      searchPlaceholder: "Tìm kiếm trợ lý...",
      searchResults: "Kết quả tìm kiếm cho",
      recommended: "Đề xuất cho bạn",
      createCardTitle: "Tạo Trợ lý",
      createCardDesc: "Thiết kế trợ lý mới với các câu lệnh và công cụ tùy chỉnh.",
      installed: "Đã cài đặt",
      launch: "Mở ứng dụng",
      noResults: "Không tìm thấy trợ lý nào khớp với",
      createModalTitle: "Tạo Trợ lý Mới",
      labelName: "Tên trợ lý",
      labelDesc: "Mô tả",
      labelInstr: "Hướng dẫn hệ thống",
      btnCancel: "Hủy",
      btnCreate: "Tạo ngay",
      placeholderName: "vd: Lên kế hoạch du lịch",
      placeholderDesc: "Mô tả ngắn gọn chức năng",
      placeholderInstr: "Bạn là một chuyên gia du lịch..."
    },
    chat: {
      inputPlaceholder: "Nhắn tin cho",
      disclaimer: "AIHub có thể mắc lỗi. Hãy kiểm tra lại thông tin quan trọng.",
      emptyState: "Tôi có thể giúp gì cho bạn hôm nay?"
    },
    auth: {
      welcome: "Chào mừng đến với AIHub",
      subtitle: "Đăng nhập để lưu lịch sử, tạo trợ lý tùy chỉnh và nâng cấp gói dịch vụ.",
      google: "Tiếp tục với Google",
      apple: "Tiếp tục với Apple",
      microsoft: "Tiếp tục với Microsoft",
      agreement: "Bằng cách tiếp tục, bạn đồng ý với Điều khoản dịch vụ và Chính sách quyền riêng tư.",
      loading: "Đang đăng nhập...",
      success: "Thành công!"
    },
    upgrade: {
      title: "Nâng cấp gói của bạn",
      subtitle: "Chọn gói phù hợp với nhu cầu của bạn. Hủy bất cứ lúc nào.",
      current: "Gói hiện tại",
      contact: "Liên hệ Kinh doanh",
      popular: "PHỔ BIẾN",
      payo: "Thanh toán theo lượt",
      payoDesc: "Giá linh hoạt theo token. Không cam kết hàng tháng.",
      amount: "Số tiền",
      estTokens: "Token ước tính",
      generate: "Tạo mã QR",
      scan: "Quét để thanh toán",
      footer: "Giá tính bằng USD. Có thể áp dụng thuế địa phương.",
      upgradeBtn: "Nâng cấp lên Pro"
    }
  }
};

export const getSystemApps = (lang: Language): AIApp[] => {
  const isVi = lang === 'vi';
  
  return [
    // 1. AIHub Chat
    {
      id: AppType.GENERAL_CHAT,
      name: isVi ? 'Trò chuyện AIHub' : 'AIHub Chat',
      description: isVi 
        ? 'Trợ lý AI đa năng cho các tác vụ hàng ngày và câu hỏi chung.' 
        : 'A versatile AI assistant for everyday tasks and questions.',
      icon: 'MessageSquare',
      systemInstruction: 'You are AIHub, a helpful, harmless, and honest AI assistant. Answer questions clearly and concisely. If the user speaks Vietnamese, answer in Vietnamese.',
      themeColor: 'bg-blue-500',
      welcomeMessage: isVi 
        ? 'Tôi là trợ lý đa năng của bạn. Bạn có thể yêu cầu tôi soạn email, giải thích các chủ đề phức tạp, lên kế hoạch sự kiện hoặc chỉ đơn giản là trò chuyện. Tôi có thể giúp gì cho bạn hôm nay?'
        : 'I am your general-purpose assistant. You can ask me to draft emails, explain complex topics, plan events, or just have a conversation. How can I help you today?',
      examplePrompts: isVi ? [
        "Giải thích máy tính lượng tử đơn giản",
        "Lên lịch trình 3 ngày đi Đà Lạt",
        "Cách làm bánh mì chua (sourdough)?",
        "Soạn email chuyên nghiệp gửi khách hàng"
      ] : [
        "Explain quantum computing in simple terms",
        "Plan a 3-day itinerary for a trip to Tokyo",
        "How do I make a sourdough starter?",
        "Draft a professional email to a client"
      ]
    },
    // 2. Muse (Creative Writer)
    {
      id: AppType.CREATIVE_WRITER,
      name: isVi ? 'Nàng Thơ' : 'Muse',
      description: isVi
        ? 'Đối tác viết sáng tạo cho truyện, thơ và nội dung quảng cáo.'
        : 'Creative writing partner for stories, poems, and copy.',
      icon: 'PenTool',
      systemInstruction: 'You are a creative writer. Use evocative language, varying sentence structures, and vivid imagery. Adjust tone based on user request.',
      themeColor: 'bg-purple-500',
      welcomeMessage: isVi
        ? 'Tôi ở đây để khơi dậy sự sáng tạo của bạn. Tôi có thể viết truyện, thơ, kịch bản hoặc nội dung tiếp thị. Hãy cho tôi biết tâm trạng, thể loại và độ dài bạn đang tìm kiếm.'
        : 'I am here to spark your creativity. I can write stories, poems, scripts, or marketing copy. Tell me the mood, genre, and length you are looking for, and I will generate a draft.',
      examplePrompts: isVi ? [
        "Viết truyện ngắn về người du hành thời gian",
        "Tạo 5 tiêu đề hấp dẫn cho bài blog",
        "Viết lại đoạn văn này cho thuyết phục hơn",
        "Làm một bài thơ Haiku về biển cả"
      ] : [
        "Write a short story about a time traveler",
        "Generate 5 catchy titles for my blog post",
        "Rewrite this paragraph to be more persuasive",
        "Compose a haiku about the ocean"
      ]
    },
    // 3. PixelGen (Image)
    {
      id: AppType.IMAGE_GENERATOR,
      name: isVi ? 'Họa Sĩ PixelGen' : 'PixelGen',
      description: isVi
        ? 'Tạo các lời nhắc chi tiết để thiết kế hình ảnh và nghệ thuật AI.'
        : 'Generate detailed prompts for AI image creation and art design.',
      icon: 'Image',
      systemInstruction: 'You are an expert AI art director. You help users craft highly detailed, stylistic prompts for image generators like Midjourney or DALL-E. Focus on lighting, composition, style (e.g., cyberpunk, oil painting), and specific artistic references.',
      themeColor: 'bg-pink-500',
      welcomeMessage: isVi
        ? 'Tôi giúp bạn biến ý tưởng thành hình ảnh. Hãy mô tả những gì bạn muốn thấy, tôi sẽ viết một "câu lệnh" (prompt) chi tiết, đầy đủ ánh sáng và phong cách nghệ thuật để bạn sử dụng cho các công cụ tạo ảnh.'
        : 'I help visualize your ideas. Describe what you want to see, and I will craft a highly detailed prompt including lighting, style, and composition that you can use with image generation tools.',
      examplePrompts: isVi ? [
        "Tạo prompt cho một thành phố tương lai cyberpunk",
        "Mô tả chân dung chú mèo theo phong cách Van Gogh",
        "Thiết kế logo tối giản cho quán cà phê",
        "Tạo khung cảnh rừng rậm huyền bí 3D"
      ] : [
        "Create a prompt for a cyberpunk city at night",
        "Describe a cat portrait in Van Gogh style",
        "Design a minimalist logo concept for a cafe",
        "Visualize a mystical 3D forest landscape"
      ]
    },
    // 4. MotionAI (Video)
    {
      id: AppType.VIDEO_GENERATOR,
      name: isVi ? 'Đạo Diễn MotionAI' : 'MotionAI',
      description: isVi
        ? 'Viết kịch bản và mô tả cảnh quay cho video AI.'
        : 'Write scripts and scene descriptions for AI video generation.',
      icon: 'Video',
      systemInstruction: 'You are a visionary film director and screenwriter. You help users plan videos by generating scene descriptions, camera angles, movement directions, and scripts suitable for AI video tools like Sora or Runway.',
      themeColor: 'bg-red-500',
      welcomeMessage: isVi
        ? 'Chào mừng đến với studio ảo. Bạn muốn làm video về gì? Tôi có thể giúp bạn phân cảnh, viết kịch bản lời thoại, hoặc mô tả chi tiết các góc quay để tạo video AI.'
        : 'Welcome to the virtual studio. What kind of video do you want to create? I can help you storyboard, write scripts, or describe detailed camera movements for AI video generation.',
      examplePrompts: isVi ? [
        "Viết kịch bản quảng cáo nước giải khát 30s",
        "Mô tả cảnh quay drone bay qua núi tuyết",
        "Lên ý tưởng video ngắn TikTok về nấu ăn",
        "Tạo cốt truyện phim hoạt hình sci-fi"
      ] : [
        "Write a script for a 30s soda commercial",
        "Describe a drone shot over snowy mountains",
        "Idea for a viral cooking TikTok video",
        "Outline a sci-fi animation plot"
      ]
    },
    // 5. Lingua (Language Tutor)
    {
      id: AppType.LANGUAGE_TUTOR,
      name: isVi ? 'Gia Sư Lingua' : 'Lingua',
      description: isVi
        ? 'Luyện tập hội thoại tiếng Anh và sửa lỗi ngữ pháp.'
        : 'Practice English conversation and get grammar corrections.',
      icon: 'Headphones',
      systemInstruction: 'You are a friendly and patient English tutor. Engage in natural conversation with the user. After every response, if the user made any grammar or vocabulary mistakes, kindly point them out and show the corrected version. Keep the tone encouraging.',
      themeColor: 'bg-teal-500',
      welcomeMessage: isVi
        ? 'Xin chào! Tôi là giáo viên tiếng Anh riêng của bạn. Chúng ta hãy trò chuyện về bất cứ chủ đề nào bạn thích. Tôi sẽ giúp bạn sửa lỗi ngữ pháp và dùng từ tự nhiên hơn sau mỗi tin nhắn.'
        : 'Hello! I am your personal English tutor. Let\'s chat about any topic you like. I will help you correct your grammar and suggest more natural phrasing after each message.',
      examplePrompts: isVi ? [
        "Giúp tôi luyện phỏng vấn xin việc",
        "Trò chuyện về sở thích hàng ngày",
        "Sửa lỗi ngữ pháp đoạn văn này",
        "Dạy tôi các thành ngữ phổ biến"
      ] : [
        "Help me practice for a job interview",
        "Let's chat about daily hobbies",
        "Correct the grammar in this paragraph",
        "Teach me some common idioms"
      ]
    },
    // 6. DevMate (Code)
    {
      id: AppType.CODE_ASSISTANT,
      name: 'DevMate',
      description: isVi
        ? 'Người bạn đồng hành lập trình chuyên nghiệp để gỡ lỗi và kiến trúc.'
        : 'Expert coding companion for debugging and architecture.',
      icon: 'Code',
      systemInstruction: 'You are an expert senior software engineer. Provide clean, efficient, and typed code. Explain your reasoning briefly before providing code blocks.',
      themeColor: 'bg-emerald-500',
      welcomeMessage: isVi
        ? 'Tôi chuyên về phát triển phần mềm. Dán mã cần gỡ lỗi, hỏi mẹo tái cấu trúc hoặc yêu cầu tính năng mới. Tôi hỗ trợ hầu hết các ngôn ngữ bao gồm Python, TypeScript và Rust.'
        : 'I specialize in software development. Paste code that needs debugging, ask for refactoring tips, or request new features. I support most major languages including Python, TypeScript, and Rust.',
      examplePrompts: isVi ? [
        "Tái cấu trúc component React này",
        "Giải thích sự khác nhau giữa TCP và UDP",
        "Viết script Python để cào dữ liệu web",
        "Gỡ lỗi truy vấn SQL này cho tôi"
      ] : [
        "Refactor this React component for better performance",
        "Explain the difference between TCP and UDP",
        "Write a Python script to scrape a website",
        "Debug this SQL query for me"
      ]
    },
    // 7. DataSight (Data)
    {
      id: AppType.DATA_ANALYST,
      name: 'DataSight',
      description: isVi
        ? 'Phân tích các mẫu dữ liệu và giải thích các khái niệm phức tạp.'
        : 'Analyze data patterns and explain complex concepts.',
      icon: 'BarChart',
      systemInstruction: 'You are a data analyst. Break down complex information into structured summaries. Use bullet points and tables where appropriate.',
      themeColor: 'bg-orange-500',
      welcomeMessage: isVi
        ? 'Tôi hỗ trợ phân tích dữ liệu và các khái niệm trực quan hóa. Hãy yêu cầu tôi giải thích xu hướng, mô hình thống kê hoặc cấu trúc báo cáo dữ liệu của bạn.'
        : 'I assist with data analysis and visualization concepts. Ask me to interpret trends, explain statistical models, or structure your data reports for clarity. Paste your data summary to get started.',
      examplePrompts: isVi ? [
        "Phân tích xu hướng AI năm 2024",
        "Giải thích độ lệch chuẩn cho trẻ 5 tuổi",
        "Cấu trúc báo cáo tiếp thị cho Quý 3",
        "So sánh Python và R cho khoa học dữ liệu"
      ] : [
        "Analyze the trends in AI for 2024",
        "Explain standard deviation to a 5-year-old",
        "Structure a marketing report for Q3",
        "Compare Python vs R for data science"
      ]
    }
  ];
};
