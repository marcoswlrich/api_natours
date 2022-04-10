import { Model } from 'mongoose';
import { ParsedQs } from 'qs';

interface IRequestQuery extends ParsedQs {
  sort: string;
  limit: string;
  page: string;
  select: string;
}

export class APIFeatures {
  protected readonly requestQuery: IRequestQuery;
  protected query: any;

  constructor(model: Model<any, any, any, any>, requestQuery: ParsedQs) {
    // Creates mongoose query and sets requestQuery
    this.query = model.find();
    this.requestQuery = requestQuery as IRequestQuery;

    this.filter = this.filter.bind(this);
    this.sort = this.sort.bind(this);
    this.limit = this.limit.bind(this);
    this.select = this.select.bind(this);
    this.paginate = this.paginate.bind(this);
    this.getQuery = this.getQuery.bind(this);
  }

  public getQuery(): any {
    return this.query;
  }

  public filter(): APIFeatures {
    const queryObj = { ...this.requestQuery };
    const excludedFields = ['limit', 'sort', 'page', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  public sort(): APIFeatures {
    if (this.requestQuery.sort) {
      this.query.sort(this.requestQuery.sort.split(',').join(' ') as string);
    } else {
      this.query.sort('-createdAt');
    }

    return this;
  }

  public limit(): APIFeatures {
    if (this.requestQuery.limit)
      this.query.limit(Number(this.requestQuery.limit as string));

    return this;
  }

  public select(): APIFeatures {
    if (this.requestQuery.fields) {
      const fields = (this.requestQuery.fields as string).split(',').join(' ');

      this.query.select(fields);
    } else {
      this.query.select('-__v');
    }

    return this;
  }

  public paginate(): APIFeatures {
    const page = (this.requestQuery.page as any) * 1 || 1;
    const limit = (this.requestQuery.limit as any) * 1 || 100;
    const skip = (page - 1) * limit;

    this.query.skip(skip).limit(limit);

    return this;
  }
}
