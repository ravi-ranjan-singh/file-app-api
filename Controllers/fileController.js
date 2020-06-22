const File = require('./../models/fileModel');
const path = require('path');
const fs = require('fs');

const getPaths = (destination, f_path, file_name, file_type) => {
  const old_path = path.join(`${__dirname}/..`, f_path);
  const new_path = path.join(
    `${__dirname}/..`,
    `${destination}/${file_name}.${file_type}`
  );
  return { old_path, new_path };
};

exports.createFile = async (req, res) => {
  const file_name = req.body.file_name;
  const file_type = req.file.mimetype.split('/')[1];
  const file_path = `/uploads/${file_name}.${file_type}`;
  const paths = getPaths(
    req.file.destination,
    req.file.path,
    file_name,
    file_type
  );
  console.log(paths);
  try {
    const file = await File.create({ file_name, file_path, file_type });
    if (file) {
      fs.renameSync(paths.old_path, paths.new_path);
      res.status(201).json({
        status: 'success',
        file,
      });
    }
  } catch (error) {
    console.log(error);
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(400).json({
        status: 'fail',
        msg: 'Duplicate File Name',
      });
    }
    res.status(500).json({
      status: 'fail',
      msg: 'Something Went Wrong',
    });
  }
};

exports.getAllFile = async (req, res) => {
  try {
    const files = await File.find().select('-__v');
    res.status(201).json({
      status: 'success',
      files,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'fail',
      msg: 'Something Went Wrong',
    });
  }
};

exports.updateFile = async (req, res) => {
  try {
    const old_file = await File.findById(req.params.id);
    let file_path = `/uploads/${req.body.file_name}.${old_file.file_type}`;
    const data = { ...req.body, date_modified: Date.now(), file_path };
    const file = await File.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    if (!file) {
      return res.status(404).json({
        status: 'fail',
        msg: 'No file found with that name',
      });
    }
    const f_path = path.join('public', old_file.file_path);
    const destination = 'public/uploads/';
    const paths = getPaths(destination, f_path, data.file_name, file.file_type);
    fs.renameSync(paths.old_path, paths.new_path);
    res.status(200).json({
      status: 'success',
      file,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'fail',
      msg: 'Something Went Wrong',
    });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);
    if (!file) {
      return res.status(404).json({
        status: 'fail',
        msg: 'No file found with that name',
      });
    }
    const f_path = path.join(`${__dirname}/../public`, file.file_path);
    fs.unlinkSync(f_path);
    res.status(204).json({
      status: 'success',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'fail',
      msg: 'Something Went Wrong',
    });
  }
};

exports.getFilebyGroup = async (req, res) => {
  try {
    const stats = await File.aggregate([
      {
        $group: {
          _id: '$file_type',
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({
      status: 'success',
      stats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'fail',
      msg: 'Something Went Wrong',
    });
  }
};
