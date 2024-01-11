import { DateTime } from 'luxon'
import { BaseModel, column ,belongsTo, BelongsTo,hasMany, HasMany} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Reply from './Reply'
import Category from './Category'

export default class Thread extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public categoryId: number

  @column()
  public title: string

  @column()
  public content: string

  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>

  @hasMany(() => Reply)
  public replies: HasMany<typeof Reply>

  
}
