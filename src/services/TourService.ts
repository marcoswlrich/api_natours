import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import { AppError } from '../errors/AppError';
import { APIFeatures } from '../utils/APIFeatures';
import { catchAsync } from '../utils/catchAsync';
import { CoordsError } from '../utils/errors/CoordsError';
import { NotFoundError } from '../utils/errors/NotFoundError';

export const deleteOne = (Model: mongoose.Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) return next(new AppError('No Document found with that ID', 404));

    return res.status(204).json({ status: 'success', data: null });
  });

export const updateOne = (Model: mongoose.Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return next(new AppError('No Document found with that ID', 404));

    return res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const createOne = (Model: mongoose.Model<any>) =>
  catchAsync(
    async (
      // for update to the req.body have the type
      req: Request,
      res: Response,
    ) => {
      const doc = await Model.create({ ...req.body });
      res.status(201).json({
        status: 'success',
        data: {
          data: doc,
        },
      });
    },
  );

export const getOne = (
  Model: mongoose.Model<any>,
  populateOption?: { path: string; select?: string },
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populateOption) query = query.populate(populateOption);
    const doc = await query;
    if (!doc) return next(new AppError('No Document found with that ID', 404));
    return res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const getAll = (Model: mongoose.Model<any>) =>
  catchAsync(async (req: Request, res: Response) => {
    // To allow for nested GET reviews on tour (heck)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // EXECUTE QUERY
    const features = new APIFeatures<mongoose.Document>(
      Model.find(filter),
      req.query as { [key: string]: string },
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.FetchData();
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

// class TourService implements ITourService {
//   public async getAll(query: any): Promise<ITour[]> {
//     // Creates mongoose query
//     const features = new APIFeatures(TourModel, query)
//       .filter()
//       .sort()
//       .select()
//       .paginate();

//     // Executes mongoose query
//     const tours = await features.getQuery();

//     return tours;
//   }

//   public async getToursByDistance(
//     distance: number,
//     latlng: string,
//     unit: string,
//   ): Promise<ITour[]> {
//     const [lat, lng] = latlng.split(',').map(c => Number(c));

//     if (!lat || !lng) throw new CoordsError();

//     const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

//     const tours = await TourModel.find()
//       .where('startLocation')
//       .within({ center: [lat, lng], radius, spherical: true });

//     return tours;
//   }

//   public async getOne(id: string): Promise<ITour> {
//     const tour = await TourModel.findById(id);
//     if (!tour) throw new NotFoundError('Tour');

//     return tour;
//   }

//   async create(dto: ITourDto): Promise<ITour> {
//     const document = await TourModel.create(dto);

//     return document;
//   }

//   public async update(id: string, partial: IPartialTourDto): Promise<any> {
//     const tour = await TourModel.findByIdAndUpdate(id, partial, {
//       new: true,
//       runValidators: true,
//     });

//     if (!tour) throw new AppError(`ID (${id}) not found!`, 404);

//     const modelName = TourModel.collection.collectionName;
//     const data = { [`${modelName}`]: tour };

//     return data;
//   }

//   public async delete(id: string): Promise<ITour> {
//     return await TourModel.findByIdAndRemove(id);
//   }
// }
// export { TourService };
