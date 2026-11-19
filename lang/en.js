/* English texts. See lang/languages.js to add a language. */
window.I18N = window.I18N || {};
window.I18N.en = {
  meta: {
    title: "Dorian Gotty Michelson | Data Scientist Engineer",
    description: "Portfolio of Dorian Gotty Michelson, data scientist engineer in Toulouse, France: background, AI projects and articles that explain artificial intelligence.",
    iaTitle: "Understanding AI | Dorian Gotty Michelson",
    sfTitle: "What I can do | Dorian Gotty Michelson",
    sfDescription: "Ten interactive demos of my skills in machine learning, data and engineering.",
    iaDescription: "Six articles with interactive demos to understand artificial intelligence, no background needed."
  },

  nav: {
    skip: "Skip to content",
    about: "About",
    skills: "What I can do",
    ai: "Understanding AI",
    contact: "Contact",
    language: "Language",
    menu: "Menu",
    themeDark: "Switch to dark theme",
    themeLight: "Switch to light theme"
  },

  hero: {
    role: "Data Scientist Engineer in Toulouse, France",
    intro: "I design, train and deploy artificial intelligence models, from raw data all the way to the dashboard that supports decisions.",
    status: "I graduated as an engineer from CESI Toulouse after a three-year work-study program, and I am looking for a role in data science or AI engineering.",
    ctaContact: "Contact me",
    ctaCv: "Download my resume (PDF, French)",
    ctaAi: "Read my articles on AI"
  },

  net: {
    aria: "Demo: a neural network learns to separate two groups of points",
    caption: "This small neural network learns, live, to separate the blue points from the orange ones. Click inside the frame to add points and watch it adapt.",
    addA: "Add blue points",
    addB: "Add orange points",
    reset: "New set of points",
    play: "Resume",
    pause: "Pause",
    iterations: "Iterations",
    accuracy: "Correctly classified"
  },

  sections: {
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
    education: "Education",
    languages: "Languages",
    passions: "Beyond code",
    contact: "Contact"
  },

  experience: [
    {
      org: "Occitaline",
      role: "Work-study engineer, developer and data scientist",
      period: "2023 – 2026",
      text: "Designed and trained AI models in Python with deep learning frameworks, and handled data management and processing. Developed in C, C# and web technologies (HTML, CSS, JavaScript, PHP), and managed SQL databases."
    },
    {
      org: "Météo France",
      role: "Research engineer",
      period: "2025, 1 month",
      text: "Integrated AI models into the operational supercomputer of the French national weather service: optimization, deployment and execution in a high-performance Linux environment."
    },
    {
      org: "SafeSquare GmbH",
      role: "Developer",
      period: "2025, 3 months",
      text: "Built a WPF plug-in (.NET, C#) that scans a network, detects connected modules and configures their IP addresses. Hands-on work with network protocols and desktop interfaces."
    }
  ],

  projects: [
    {
      title: "Predictive maintenance for control valves",
      context: "Master’s final project",
      text: "A model that anticipates failures from pressure, flow and position sensors. I compared several anomaly detection and failure prediction approaches (XGBoost, Isolation Forest, LSTM), then presented the results in a Power BI dashboard.",
      tags: ["Python", "Pandas", "Scikit-learn", "XGBoost", "TensorFlow", "Power BI"],
      link: { href: "ia.html#panne", label: "Understand predictive maintenance" }
    },
    {
      title: "Automatic image captioning",
      context: "Deep learning project",
      text: "Encoder-decoder architecture: a ResNet convolutional network extracts image features, then an LSTM with an attention mechanism writes the caption. Trained on MS COCO, evaluated with the BLEU score and compared with the BLIP model through Hugging Face.",
      tags: ["PyTorch", "ResNet", "LSTM", "Attention", "Hugging Face"],
      link: { href: "ia.html#vision", label: "Understand how AI sees an image" }
    },
    {
      title: "Task management software",
      context: "Software project",
      text: "An application to create, assign, prioritize and track tasks. WPF interface with an MVVM architecture, data stored in SQL Server through Entity Framework Core, xUnit tests and Git version control.",
      tags: ["C#", ".NET", "WPF", "MVVM", "SQL Server", "xUnit"]
    }
  ],

  skills: [
    { name: "AI and data", items: ["Python", "PyTorch", "TensorFlow", "Scikit-learn", "XGBoost", "Pandas", "Hugging Face", "Power BI"] },
    { name: "Development", items: ["C", "C#", ".NET", "WPF", "JavaScript", "HTML / CSS", "PHP"] },
    { name: "Data and tools", items: ["SQL", "SQL Server", "Entity Framework Core", "Git", "Linux", "High-performance computing"] }
  ],

  education: [
    { school: "CESI Toulouse", degree: "Engineering degree (Master’s level), with integrated preparatory cycle", period: "2021 – 2026" },
    { school: "IPSA Toulouse", degree: "Engineering school program", period: "2020 – 2021" },
    { school: "Lycée Françoise, Tournefeuille", degree: "French scientific baccalaureate", period: "2017 – 2020" }
  ],

  languages: [
    { name: "French", level: "Native" },
    { name: "English", level: "B2" },
    { name: "Spanish", level: "B1" }
  ],

  passions: [
    { title: "Drums", text: "Fifteen years of drumming and two bands taught me to work as a team: listening to others, keeping a shared tempo and finding my place in a group." },
    { title: "Running", text: "I am a marathon runner. Running taught me that to be good in a team, you first have to be solid on your own: otherwise you hold back the others, who are waiting for you to master your own specialty." },
    { title: "Stand-up comedy", text: "Getting on stage made me comfortable speaking in public. It is an asset I use in my professional life, to present a project or explain a technical result." }
  ],

  contact: {
    intro: "A job offer, or a question about a project or an article? Write to me with this form or directly by email.",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send message",
    sending: "Sending…",
    sent: "Message sent. Thank you, I will get back to you soon.",
    error: "The message was not sent. Try again, or email me directly at the address shown here.",
    invalid: "Enter your name, a valid email and a message.",
    mailto: "Your email app opens with the message filled in: just press send.",
    direct: "Reach me directly",
    emailLabel: "Email",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
    cvLabel: "Resume (PDF)"
  },

  footer: {
    made: "Designed and hand-coded in HTML, CSS and JavaScript.",
    stats: "Anonymous, cookie-free visitor statistics (Umami)."
  },

  sf: {
    title: "What I can do",
    intro: "Ten short, interactive examples of the techniques I use. Click, drag, try things out: each card is a small sample of my work, with the equivalent Python code.",
    note: "The data in these examples is fictional or simulated.",
    cta: "See these skills in action",
    groups: {
      ml: "Machine learning",
      data: "Data and visualization",
      eng: "Engineering and systems"
    },
    code: "Show the Python code",
    codeCs: "Show the C# equivalent (Entity Framework Core)",
    career: "In my experience",

    threshold: {
      title: "Set a model’s alert threshold",
      text: "A maintenance model gives each machine a risk score. Where should the alert threshold go? The lower it is, the more failures you catch, but the more false alarms you trigger.",
      career: "Choosing the detection threshold in my final project on control valves.",
      threshold: "Alert threshold",
      normal: "Healthy machines",
      faulty: "Machines about to fail",
      score: "Risk score",
      tp: "Failures caught",
      fn: "Failures missed",
      fp: "False alarms",
      tn: "Healthy, left alone",
      precision: "Precision",
      precisionHelp: "of alerts are justified",
      recall: "Recall",
      recallHelp: "of failures are caught"
    },

    tree: {
      title: "Explain a prediction",
      text: "A decision tree predicts by asking simple questions. XGBoost combines hundreds of trees, but you can still explain what drove a decision. Set the valve’s condition and follow the path.",
      career: "XGBoost failure prediction models in my final project.",
      pressure: "Pressure",
      temperature: "Temperature",
      age: "Valve age",
      years: "years",
      risk: "Failure risk",
      low: "Low",
      medium: "Moderate",
      high: "High",
      yes: "yes",
      no: "no",
      qAge: "Older than 8 years?",
      qPressure: "Pressure above 7 bar?",
      qTemp90: "Temperature above 90 °C?",
      qTemp100: "Temperature above 100 °C?"
    },

    kmeans: {
      title: "Group data without labels",
      text: "The k-means algorithm finds groups of similar points on its own: customer profiles, types of failures, operating modes of a machine. Click inside the frame to add points.",
      k: "Number of groups",
      step: "One step",
      run: "Group",
      newData: "New data",
      iter: "Iterations",
      done: "The centers have stopped moving: the algorithm has converged."
    },

    sentiment: {
      title: "Analyze the tone of a text",
      text: "Natural language processing sorts customer reviews, emails or support tickets. This simplified version relies on a word list; in production, I would use a Transformer model through Hugging Face.",
      career: "Language processing (LSTM, attention, Hugging Face) in my image captioning project.",
      input: "Text to analyze",
      examples: [
        "The service was fast and the team really friendly.",
        "Late delivery and damaged product, very disappointed.",
        "The product is not bad, but the price is too high."
      ],
      positive: "Positive",
      negative: "Negative",
      neutral: "Neutral",
      score: "Score",
      lexicon: {
        pos: ["fast", "quick", "friendly", "excellent", "great", "perfect", "good", "nice", "awesome", "efficient", "satisfied", "recommend", "clean", "clear", "helpful", "happy", "reliable", "simple", "thanks", "love", "pleasant", "responsive"],
        neg: ["slow", "late", "damaged", "disappointed", "disappointing", "bad", "expensive", "high", "problem", "broken", "dirty", "awful", "horrible", "complicated", "noisy", "useless", "never", "poor", "worst", "rude"],
        negators: ["not", "no", "never", "isn", "wasn", "don", "doesn", "didn"]
      }
    },

    forecast: {
      title: "Forecast a time series",
      text: "What will the temperature be each month next year? The method learns from the past, then its error is measured on a year it has never seen. Compare three approaches.",
      career: "AI models integrated into Météo France’s supercomputer, and LSTMs on time series in my final project.",
      mean: "Average",
      trend: "Trend",
      seasonal: "Seasons + trend",
      meanHelp: "Always predicts the past average.",
      trendHelp: "Extends the overall trend, ignoring seasons.",
      seasonalHelp: "Repeats the seasonal cycle and adds the trend.",
      history: "History",
      actual: "Actual (test year)",
      forecast: "Forecast",
      error: "Mean error",
      newData: "New series"
    },

    cleaning: {
      title: "Clean raw data",
      text: "Before any model comes imperfect data: duplicates, missing values, inconsistent formats, outliers. Apply each step and watch the table fix itself.",
      career: "Data management and processing during my work-study at Occitaline.",
      sensor: "Sensor",
      date: "Date",
      pressure: "Pressure (bar)",
      dup: "Remove duplicates",
      num: "Convert numbers",
      dates: "Standardize dates",
      fill: "Fill missing values",
      outliers: "Remove outliers",
      remaining: "Issues left",
      clean: "Clean data, ready for training.",
      reset: "Start over"
    },

    sql: {
      title: "Query a database",
      text: "A task database, like the one in my project management software. Pick a question: here is the SQL query that answers it, and its result.",
      career: "SQL databases during my work-study, and SQL Server with Entity Framework Core in my task management software.",
      table: "Table tasks",
      result: "Result",
      rows: "rows",
      queries: [
        { label: "Urgent tasks not yet done", sql: "SELECT title, owner, days\nFROM tasks\nWHERE priority = 'high' AND status <> 'done'\nORDER BY days DESC;" },
        { label: "Workload per person", sql: "SELECT owner, COUNT(*) AS task_count, SUM(days) AS days\nFROM tasks\nGROUP BY owner\nORDER BY days DESC;" },
        { label: "Project progress", sql: "SELECT status, COUNT(*) AS n,\n       ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM tasks)) AS pct\nFROM tasks\nGROUP BY status;" }
      ],
      cols: { id: "id", title: "title", owner: "owner", priority: "priority", status: "status", days: "days", count: "task_count", n: "n", pct: "pct" },
      priority: { high: "high", medium: "medium", low: "low" },
      status: { todo: "to do", doing: "in progress", done: "done" },
      titles: ["Collect sensor data", "Clean the dataset", "Train the model", "Build the dashboard", "Write the documentation", "Write unit tests", "Deploy to production", "Present the results"]
    },

    dashboard: {
      title: "Explore a dashboard",
      text: "As in Power BI, click a site or a month to filter the whole dashboard. Click again to remove the filter.",
      career: "Power BI valve monitoring dashboard in my final project.",
      interventions: "Interventions",
      failures: "Failures",
      availability: "Availability",
      bySite: "Interventions by site",
      byMonth: "Failures by month",
      all: "Show all",
      filter: "Filter",
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    },

    parallel: {
      title: "Speed up a computation in parallel",
      text: "A supercomputer splits the work across many cores. But the part that cannot be split limits the gain: that is Amdahl’s law. Play with both settings.",
      career: "Deploying AI models on Météo France’s operational supercomputer.",
      cores: "Cores",
      serial: "Non-parallel share",
      run: "Run the computation",
      time: "Duration",
      speedup: "Speedup",
      ideal: "theoretical maximum",
      serialLabel: "Sequential part",
      parallelLabel: "Tasks spread across cores",
      core: "Core"
    },

    subnet: {
      title: "Compute an IP subnet",
      text: "To configure devices on a network, you need to know which addresses belong together. Enter an address and change the mask.",
      career: "Plug-in that detects network modules and configures their IP addresses at SafeSquare.",
      ip: "IP address",
      prefix: "Mask",
      mask: "Mask",
      network: "Network address",
      broadcast: "Broadcast address",
      range: "Usable addresses",
      hosts: "Possible devices",
      binary: "In binary, the network part is colored",
      invalid: "Invalid address: four numbers between 0 and 255, separated by dots."
    }
  },

  ia: {
    title: "Understanding AI",
    intro: "Artificial intelligence is everywhere, but rarely explained. Here are six short articles, from the big picture to concrete cases, to understand what really happens inside. Most of them come with a demo you can play with.",
    toc: "Contents",
    outro: "A question about one of these topics, or a subject you would like to see explained here?",
    outroLink: "Write to me",

    bases: {
      nav: "AI, machine learning, deep learning",
      title: "AI, machine learning, deep learning: who is who?",
      lead: "Three terms often used as synonyms. They actually describe nested circles.",
      body: `
<p><strong>Artificial intelligence</strong> is the broadest field: any program that performs a task we thought only humans could do, such as playing chess, translating a text or recognizing a face. The first systems followed rules written by hand by experts: “if the temperature is above 39 °C and the cough persists, then…”.</p>
<p><strong>Machine learning</strong> takes a different approach. Instead of writing the rules, we give the program thousands of examples and it finds the patterns by itself. To filter spam, nobody lists every suspicious word: we show the algorithm emails that are already sorted, and it learns to tell them apart.</p>
<p><strong>Deep learning</strong> is a family of machine learning methods built on neural networks with many layers. It is behind the major recent breakthroughs in vision, speech recognition and text generation.</p>
<p>Finally, <strong>generative AI</strong> (ChatGPT, image generators) is an application of deep learning: models that produce new content instead of simply classifying what they are given.</p>`,
      diagram: {
        ai: "Artificial intelligence",
        ml: "Machine learning",
        dl: "Deep learning",
        gen: "Generative AI",
        caption: "Each circle is a special case of the one around it."
      },
      after: `<p class="takeaway"><strong>Key point:</strong> all deep learning is machine learning, and all machine learning is AI. The reverse is not true.</p>`
    },

    apprendre: {
      nav: "How a machine learns",
      title: "How does a machine learn?",
      lead: "For a machine, learning means adjusting numbers until its mistakes become small.",
      body: `
<p>A model is a formula with settings, called <strong>parameters</strong>. The simplest possible one is a straight line: <code>prediction = a × x + b</code>. It has two parameters: <code>a</code>, the slope, and <code>b</code>, the height.</p>
<p>Learning always follows the same loop:</p>
<ol>
  <li>the model makes a prediction for each example;</li>
  <li>we measure its <strong>error</strong> by comparing it with the right answer;</li>
  <li>we compute in which direction each parameter should move to reduce that error;</li>
  <li>we take a small step in that direction, then start again.</li>
</ol>
<p>This is <strong>gradient descent</strong>. Picture yourself on a mountain in thick fog, looking for the valley: you feel the slope under your feet and take a step downhill, again and again.</p>
<p>The size of the step is the <strong>learning rate</strong>. Too small, and learning takes forever. Too large, and you leap over the valley while the error blows up. Try it below.</p>`,
      after: `<p>A neural network like the one behind ChatGPT works on exactly this principle, but with billions of parameters instead of two, and an automatic way of computing the directions called <strong>backpropagation</strong>.</p>`
    },

    chatgpt: {
      nav: "How ChatGPT works",
      title: "How does ChatGPT work?",
      lead: "ChatGPT does not look up answers in a database. It guesses, word after word, the most likely continuation.",
      body: `
<p>ChatGPT is a <strong>large language model</strong> (LLM). It was first trained on a huge amount of text with a single goal: predict the next word. More precisely, it splits text into small pieces called <strong>tokens</strong>, a word or part of a word.</p>
<p>To predict the rest of a sentence well, a model has to pick up a lot: grammar, the meaning of words, facts about the world, and even simple reasoning. That is what makes it seem to “understand”.</p>
<p>When you ask a question, the model computes a probability for every possible token, picks one, appends it to the text, and repeats until the answer is complete. Its architecture, the <strong>Transformer</strong>, relies on an <strong>attention</strong> mechanism that links every word to all the words before it, even distant ones.</p>
<p>A second training phase, guided by human feedback, then teaches it to give helpful answers rather than just continue the text.</p>`,
      after: `<p>The <strong>temperature</strong> controls how much chance is involved: low, the model nearly always picks the most likely word; high, it dares less expected words. It is also why a language model can confidently state something false: it produces what is plausible, not what is verified.</p>`,
      model: {
        start: ["The", "cat"],
        end: ".",
        table: {
          "cat": [["sleeps", 0.34], ["eats", 0.26], ["watches", 0.22], ["plays", 0.18]],
          "sleeps": [["on", 0.48], ["in", 0.37], [".", 0.15]],
          "eats": [["its", 0.55], ["a", 0.30], [".", 0.15]],
          "watches": [["the", 0.85], [".", 0.15]],
          "plays": [["with", 0.70], ["in", 0.20], [".", 0.10]],
          "on": [["the", 1.0]],
          "in": [["the", 1.0]],
          "with": [["the", 0.55], ["a", 0.45]],
          "its": [["bowl", 0.70], ["mouse", 0.30]],
          "a": [["mouse", 0.60], ["treat", 0.40]],
          "the": [["sofa", 0.30], ["garden", 0.25], ["bed", 0.15], ["window", 0.15], ["birds", 0.15]],
          "then": [["sleeps", 0.40], ["eats", 0.30], ["plays", 0.30]]
        },
        fallback: [[".", 0.70], ["then", 0.30]]
      }
    },

    vision: {
      nav: "How AI sees an image",
      title: "How does AI see an image?",
      lead: "To a computer, an image is just a table of numbers. The whole challenge is finding shapes in it.",
      body: `
<p>A photo is a grid of pixels, and each pixel is a number giving its intensity (three numbers for a color image: red, green, blue). A smartphone photo is millions of numbers.</p>
<p><strong>Convolutional neural networks</strong> (CNNs) analyze this grid with small <strong>filters</strong>: 3 × 3 squares of numbers slid across the whole image. At each position, the pixels are multiplied by the filter’s numbers and everything is added up. The result is strong wherever the image looks like the filter’s pattern.</p>
<p>The first layers detect edges and textures. The next ones combine those edges into shapes (an eye, a wheel), then into whole objects. The big difference from classic image processing: the network is not given hand-picked filters, it <strong>learns</strong> the useful ones by itself during training.</p>`,
      after: `<p>My image captioning project is built on this principle: a CNN (ResNet) turns the image into a numerical description, then a language network translates it into a sentence such as “a dog running on the beach”.</p>`
    },

    panne: {
      nav: "Predicting a failure",
      title: "Predicting a failure before it happens",
      lead: "A machine about to break down often shows early warning signs. AI helps spot them in time.",
      body: `
<p>In industry, maintenance is traditionally done either after a failure, which is expensive and can be dangerous, or on a fixed schedule, at the risk of replacing parts that are still fine. <strong>Predictive maintenance</strong> offers a third way: monitor the real condition of the equipment and step in at the right time.</p>
<p>Sensors continuously measure pressure, flow, temperature or vibration. A model learns what <strong>normal operation</strong> looks like, then flags anything that departs from it: this is <strong>anomaly detection</strong>.</p>
<p>The simplest method computes, at every moment, the average and the spread (the standard deviation) of recent measurements. A value too far from the average triggers an alert. The whole difficulty is setting the threshold: too low, and false alarms pile up; too high, and real failures are missed.</p>`,
      after: `<p>In my final project on control valves, I compared this logic with more advanced models: <strong>Isolation Forest</strong>, which isolates unusual measurements, <strong>XGBoost</strong>, which learns from past failures, and an <strong>LSTM</strong> network, which can follow how a signal evolves over time.</p>`
    },

    limites: {
      nav: "Limits and biases",
      title: "The limits and biases of AI",
      lead: "AI is neither neutral nor infallible. It reflects its data and does not know what it does not know.",
      body: `
<p><strong>It reproduces the biases in its data.</strong> A model learns from past examples. A recruiting tool trained on ten years of mostly male resumes may learn that being a man is a sign of success. That is what happened to Amazon, which dropped such a tool in 2018.</p>
<p><strong>It can be wrong with confidence.</strong> Language models sometimes produce false but perfectly worded information, called <strong>hallucinations</strong>. They generate plausible text without checking facts.</p>
<p><strong>It generalizes poorly outside its comfort zone.</strong> A model trained on daytime photos can fail at night. A maintenance model trained on a new machine can be thrown off by a worn one.</p>
<p><strong>It is hard to explain.</strong> A neural network with millions of parameters does not justify its decisions. That is a real problem in medicine or finance, and a whole research field, <strong>explainable AI</strong>, is dedicated to it.</p>
<p><strong>It has an energy cost.</strong> Training and running large models takes a lot of computing power, and therefore electricity, plus water to cool data centers.</p>`,
      after: `<p class="takeaway"><strong>Key point:</strong> AI is a powerful statistical tool. Using it well means checking its data, measuring its errors and keeping a human in the loop for important decisions.</p>`
    }
  },

  demo: {
    gradient: {
      title: "Fit a line to the points",
      help: "Start training and watch the line settle. Then raise the learning rate a lot and try again.",
      step: "Take one step",
      train: "Train",
      stop: "Stop",
      reset: "Start over",
      lr: "Learning rate",
      steps: "Steps",
      error: "Mean error",
      model: "Model",
      diverged: "The error is blowing up: the step is too large, so the model jumps over the solution.",
      converged: "The error has almost stopped decreasing: the model has found its best line.",
      aria: "Chart: data points and a line fitted by gradient descent"
    },
    nextword: {
      title: "Predict the next word",
      help: "This mini model only knows about thirty words, but it works on the same principle. Click a word, or let the model draw one at random according to the probabilities.",
      pick: "Let the model choose",
      restart: "Start over",
      temperature: "Temperature",
      candidates: "Possible next words",
      done: "Sentence complete. Start over to generate another one.",
      endToken: "end of sentence"
    },
    conv: {
      title: "Apply a filter to an image",
      help: "Draw in the left image, then switch filters. Hover over the result to see which pixels are combined.",
      input: "Image",
      output: "Result",
      kernel: "3 × 3 filter",
      filter: "Filter",
      clear: "Clear",
      sample: "Sample image",
      filters: {
        edgesV: "Vertical edges",
        edgesH: "Horizontal edges",
        outline: "All edges",
        blur: "Blur",
        sharpen: "Sharpen"
      },
      aria: "32 by 32 pixel image you can draw on"
    },
    anomaly: {
      title: "Monitor a sensor",
      help: "The signal contains two simulated incidents (orange areas): a sudden spike and a gradual drift. Set the threshold to catch them without piling up false alarms.",
      threshold: "Threshold",
      unit: "standard deviations",
      detected: "Incidents detected",
      falseAlerts: "False alarms",
      newData: "New measurements",
      legendSignal: "Measurement",
      legendBand: "Normal range",
      legendIncident: "Real incident",
      legendAlert: "Alert",
      aria: "Chart: sensor signal, normal range and alerts"
    }
  }
};
