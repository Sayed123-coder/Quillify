import Blog from "../models/Blog.js";


export const createBlog= async (req,res) =>{
   try{
      const {title,content,category,thumbnail,status}=req.body;

      if(!title || !content || !thumbnail || !category){
         return res.status(400).json({message:"Please provide all information"});
      }

      const blog= await Blog.create({
         title,
         content,
         thumbnail,
         category,
         author:req.user._id,
         status: status || "draft",
      })

      return res.status(201).json({message:"Blog created",blog});
   }
   catch(err){
     return res.status(400).json({message:err.message});
   }
}

export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      author: req.user._id,
      isDeleted: false,
    })
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({ blogs });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
export const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const category = req.query.category || "";

    
    const filter = {
      isDeleted: false,
      isPublished: true,
    };

    
    if (category && category !== "All") {
      filter.category = category;
    }

  
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const totalBlogs = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalBlogs / limit);

    return res.status(200).json({
      blogs,
      currentPage: page,
      totalPages,
      totalBlogs,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const getBlogById=async(req,res)=>{
    try{
     
        const {id}=req.params;

        const blog = await Blog.findByIdAndUpdate(
          id,
          { $inc: { views: 1 } },
          { returnDocument: "after" },
        ).populate("author", "name avatar");

        if(!blog){
            return res.status(404).json({message:"Blog cannot be retrieved"});
        }

        return res.status(200).json({blog});
    }
    catch(err){
        return res.status(400).json({message:err.message});
    }
}

export const updateBlog=async(req,res)=>{
    try{
      
        const {id}=req.params;
        const {title,content,thumbnail,category,status}=req.body;

        if(!title || !content || !thumbnail || !category || !status){
            return res.status(400).json({message:"Please provide all details"});
        }

        const blog=await Blog.findById(id);

        if(!blog){
            return res.status(404).json({message:"Blog not found"});
        }

        if(String(blog.author)!==String(req.user._id)){
            return res.status(403).json({message:"You cannot edit this blog"});
        }
        
        const updatedBlog=await Blog.findByIdAndUpdate(
            id,
            {title,content,thumbnail,category,status},
            { returnDocument: "after" },
        )
        
       return res.status(200).json({message:"Blog Updated",updatedBlog});

    }
    catch(err){
        return res.status(400).json({message:err.message});
    }
} 


export const deleteBlog=async(req,res)=>{
    try{
       
        const {id}=req.params;

        const blog=await Blog.findById(id);

        if(!blog){
          return res.status(404).json({message:"Cannot find the blog"});  
        }

        const isAuthor=String(blog.author) === String(req.user._id);
        const isAdmin=req.user.role === "admin"

        if(!isAuthor && !isAdmin){
            return res.status(403).json({message:"You cannot delete this blog"});
        }
       
        const deletedBlog=await Blog.findByIdAndUpdate(id,{isDeleted:true,isPublished:false},{ returnDocument: "after" });
       
         return res.status(200).json({message:"Blog Deleted",deletedBlog});

    }
    catch(err){
      return res.status(400).json({message:err.message});
    }
}

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    
    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyLiked) {
      
      await Blog.findByIdAndUpdate(id, { $pull: { likes: userId } });
      return res.status(200).json({ message: "Unliked", liked: false });
    } else {
     
      await Blog.findByIdAndUpdate(id, { $addToSet: { likes: userId } });
      return res.status(200).json({ message: "Liked", liked: true });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};