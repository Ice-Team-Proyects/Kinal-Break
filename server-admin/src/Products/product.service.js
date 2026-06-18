import Product from "../Products/product.model.js";

export const createProductRecord = async(data)=>{
    return await Product.create(data);
};

export const fetchProducts = async(query)=>{

    const filter = { isDeleted: false };

    if(query.category){
        filter.category = query.category;
    }

    if(query.search){
        filter.name = {
            $regex: query.search,
            $options:"i"
        };
    }

    return await Product.find(filter)
    .populate("accompaniments");
};

export const fetchProductById = async(id)=>{
    return await Product.findById(id)
    .populate("accompaniments");
};

export const updateProductRecord = async(id,data)=>{
    return await Product.findByIdAndUpdate(
        id,
        data,
        { new:true }
    );
};

export const deleteProduct = async(id)=>{
    return await Product.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new:true }
    );
};

export const restoreProduct = async(id)=>{
    return await Product.findByIdAndUpdate(
        id,
        { isDeleted: false },
        { new:true }
    );
};