import type { InternalAxiosRequestConfig } from 'axios'
import type { driveType, engineType } from '@/utils/config'

export interface CustomConfig extends InternalAxiosRequestConfig {
  public?: boolean
  list?: boolean
  loading?: boolean
}

export interface ApiResourceConfig {
  list: CustomConfig
  find: (id: string | number) => CustomConfig
  create: CustomConfig
  update: (id: string | number) => CustomConfig
  delete: (id: string | number) => CustomConfig

  [key: string]: CustomConfig | ((id: string | number) => CustomConfig)
}

interface BaseApi {
  id?: number
  documentId: string
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

interface Pagination {
  page: number
  pageCount: number
  pageSize: number
  total: number
}

export interface DataList<T> {
  data: T[]
  meta: {
    pagination: Pagination
  }
}

export interface BaseData<T> {
  data: T
  meta: {}
}

export type ApiResponse<T> = DataList<T> | BaseData<T>

export interface Media extends BaseApi {
  alternativeText: string | null
  caption: string | null
  ext: string
  formats: {
    thumbnail: {
      url: string
    }
  }
  hash: string
  height: number
  mime: string
  name: string
  previewUrl: string | null
  provider: string
  provider_metadata: string | null
  size: number
  url: string
  width: number
}

export interface Color extends BaseApi {
  name: string
  code: string
}

export interface Trim extends BaseApi {
  year: number
  version: string
  msrp: number
  memo: string
  image: Media
  engine_displacement: number
  engine_type: 'gasoline' | 'diesel' | 'hybrid' | 'electric'
  horsepower: number
  transmission: string
  drive_type: string
  battery_capacity: number
  name: string
  model: Model
  chinese?: string
}

export type EngineKey = keyof typeof engineType
export type DriveKey = keyof typeof driveType

export interface Model extends BaseApi {
  name: string
  make: Make
  year_start: number
  year_end: number
  chinese?: string
}

export interface Product extends BaseApi {
  name: string
  displayName: string
  price: number
  duration: number
  disabled: boolean
  image: Media
}

export interface Car extends BaseApi {
  used: boolean
  vin: string
  mileage: number
  price: number
  trim: Trim
  media: Media[]
  sold: boolean
  memo: string
  year: number
  color_exterior: Color
  color_interior: Color
  currency: 'RUB' | 'CNY' | 'USD' | 'EUR'
  displayPrice?: number
  location: Location
}

export interface Make extends BaseApi {
  name: string
  country: string
  logo: Media
  models?: Model[]
  chinese?: string
}

export interface Order extends BaseApi {
  product: Product
  qty: number
  code: string
  brokerServer: string
  brokerName: string
  transactionAccount: string
  binding: string
  endDate: string
  generatedDate: string
  customer: User
  productName: string
  price: number
  total: number
  paymentPic: Media
  orderStatus: string
}

export interface Contact extends BaseApi {
  name: string
  email: string
  phone: string
  message: string
  replied: boolean
  car?: Car
  trim?: Trim
}

export interface Contract extends BaseApi {
  signed: boolean
  customer_email?: string
  filename?: string
  sign_time?: Date
  signature_image?: Media
  customer_name?: string
  url?: string
  deprecated?: boolean
  send_by?: string
  all_signed_date?: Date
  signed_user?: User
  contract_type?: string
  user_signature_image?: Media
  content?: string
  order: Order
}

export interface Customer extends BaseApi {
  name: string
  state: string
  city: string
  street: string
  zip: string
  email: string
  phone: string
  type: string
  status: string
  note: string
  address?: Address
}

export interface Address extends BaseApi {
  state: string
  city: string
  street: string
  zip: string
  country: string
}

export interface User extends BaseApi {
  email: string
  username: string
}

export interface UserRole extends BaseApi {
  name: string
  type: string
}

export interface MenuItem extends BaseApi {
  title: string
  link?: string
  icon?: string
  group?: string
  children?: MenuItem[]
}

export interface OrderItem extends BaseApi {
  order: Order
  quantity: number
  price: number
  discount: number
  total: number
  currency: string
  status: string
  note?: string
  car: Car
}

export interface Location extends BaseApi {
  city: string
  port: boolean
  country: string
}

export interface OrderStatus extends BaseApi {
  name: string
  title: string
  level: number
  color: 'info' | 'success' | 'warning' | 'error'
}

export interface Rate extends BaseApi {
  from: string
  to: string
  rate: number
}

type FieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'date'
  | 'file'
  | 'custom'
export type FieldConfig = {
  key: string
  label: string
  type?: FieldType
  items?: any[] | (() => Promise<any[]>)
  itemText?: string
  itemValue?: string
  multiple?: boolean
  rules?: ((v: any) => boolean | string)[]
  component?: any
  props?: Record<string, any>
}
