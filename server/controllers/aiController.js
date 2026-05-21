import groq from "../config/groq.js";

export const generateBlog=async (req,res)=>{
    try{
       
        const {title}=req.body;

        if(!title){
            return res.status(400).json({message:"Please provide a title"});
        }

        const completion=await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages:[
                 {
                    role: "system",
                    content: `You are a professional blog writer. 
                    Always respond in valid JSON format only, no extra text.
                    JSON structure must be:
                    {
                        "title": "blog title here",
                        "content": "full blog content here",
                        "category": "one of: Technology, Lifestyle, Health, Education, Entertainment, Other"
                    }
                    For the content field, use proper HTML tags:
                    - Use <h2> for main headings
                    - Use <h3> for subheadings
                    - Use <p> for paragraphs
                    - Use <ul> and <li> for lists
                    - Use <strong> for bold text
                    - Start with intro paragraph, end with conclusion`,
                },
                {
                    role:"user",
                    content: `Write a detailed blog post about: ${title}`,
                },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" },
        });
          
        const rawText= completion.choices[0].message.content;
        
        const cleaned = rawText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        const blogData=JSON.parse(cleaned);

        return res.status(200).json({ blog: blogData });

    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};


export const improveBlog=async(req,res)=>{
    try{

        const {content}=req.body;

        if (!content) {
            return res.status(400).json({ message: "Please provide content" });
        }

        const completion=await groq.chat.completions.create({
            model:"llama-3.3-70b-versatile",
            messages:[
                {
                    role: "system",
                    content: `You are a professional blog editor.
                    Improve the given blog content — better flow, grammar, and structure.
                    Return only the improved content in HTML format using proper tags like <h2>, <h3>, <p>, <ul>, <li>, <strong>.
                    Nothing else — no extra text, no markdown.`,
                },
                {
                    role: "user",
                    content: `Improve this blog content: ${content}`,
                },
            ],
            temperature: 0.7,
        });

        const improvedContent=completion.choices[0].message.content;

        return res.status(200).json({ improvedContent });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

export const suggestTags = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Please provide content" });
        }

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are a blog SEO expert.
                    Suggest relevant tags for the given blog content.
                    Always respond in valid JSON only:
                    {
                        "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
                    }`,
                },
                {
                    role: "user",
                    content: `Suggest tags for this content: ${content}`,
                },
            ],
            temperature: 0.5,
            response_format: { type: "json_object" },
        });

        const rawText = completion.choices[0].message.content;
        const { tags } = JSON.parse(rawText);

        return res.status(200).json({ tags });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};