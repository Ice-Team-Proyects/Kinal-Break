import Accompaniment from "../Accompaniment/accompaniment.model.js";

export const createAccompaniment = async (data) => {
    return await Accompaniment.create(data);
};

export const fetchAccompaniments = async () => {
    return await Accompaniment.find({ isDeleted: false });
};

export const updateAccompaniment = async (id, data) => {
    return await Accompaniment.findByIdAndUpdate(
        id,
        data,
        { new: true }
    );
};

export const deleteAccompaniment = async (id) => {
    return await Accompaniment.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    );
};

export const restoreAccompaniment = async (id) => {
    return await Accompaniment.findByIdAndUpdate(
        id,
        { isDeleted: false },
        { new: true }
    );
};