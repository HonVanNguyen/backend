import {
  DataSource,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { I18nPath } from 'src/i18n/i18n.generated';
import { NotFoundExc } from '../exceptions/custom.exception';

export abstract class BaseRepository<
  T extends ObjectLiteral,
> extends Repository<T> {
  abstract entityNameI18nKey: I18nPath | string;
  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    super(entity, dataSource.createEntityManager());
  }

  async findFirst(options: FindOneOptions<T>) {
    return super.findOne(options);
  }

  async findFirstBy(options: FindOptionsWhere<T>) {
    return super.findOne({ where: options });
  }

  async findOne(options: FindOneOptions<T>): Promise<T> {
    const [result] = await this.find({ ...options });

    return result;
  }

  async findOneBy(
    options: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<T> {
    const [result] = await this.findBy(options);

    return result;
  }

  async findOneWithoutRelation(options: FindOneOptions<T>): Promise<T> {
    const [result] = await this.find({ ...options, take: 1 });

    return result;
  }

  async findOneByWithoutRelation(whereOpts: FindOptionsWhere<T>): Promise<T> {
    const [result] = await this.find({ where: whereOpts, take: 1 });

    return result;
  }

  async findOneOrThrowNotFoundExc(options: FindManyOptions<T>) {
    const [result] = await this.find(options);
    if (!result)
      throw new NotFoundExc({
        message: [this.entityNameI18nKey, 'exception.notFound'],
      });

    return result;
  }

  async findOneByOrThrowNotFoundExc(
    conditions: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ) {
    const [result] = await this.findBy(conditions);
    if (!result)
      throw new NotFoundExc({
        message: [this.entityNameI18nKey, 'exception.notFound'],
      });

    return result;
  }
}
