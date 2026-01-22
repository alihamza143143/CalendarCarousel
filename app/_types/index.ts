
export enum TimelineSendEventEnum {
  FIRST_CLASS_MAIL = 'First-Class Mail',
  CERTIFIED = 'Certified',
  POSTCARD = 'Postcard',
  ROBO_TRACE = 'Robo-Trace'
}
export enum TimelineScoutEventEnum {
  ROBO_TRACE = 'robo-trace',
  LIVE_TRACE = 'live-trace'
}

export enum TimelineStoreEventEnum {
  TAX_SALE = 'Tax Sale',
  PROPERTY_AUCTION = 'Property Auction'
}

export enum TimelineSearchEventEnum {
  BANKRUPTCY_RESEARCH = 'Bankruptcy Research',
  LIMITED_TITLE_SEARCH = 'Limited Title Search',
  FULL_TITLE_SEARCH = 'Full Title Search',
  IP_RESEARCH = 'IP Research',
  TAX_SALE_PARTY_AND_TITLE_SEARCH = 'Tax Sale Party and Title Search',
  PROPERTY_AUCTION_PARTY_AND_TITLE_SEARCH = 'Property Auction Party and Title Search'
}

export enum TimelineSignEventEnum {
  REMOTE_NOTARY = 'Remote Notary'
}


export enum IconWithCustomHeight {
  CALENDAR_DATE = 'calendarDate',
  PRICING_ICON = 'pricingIcon',
  BOUY_ICON = 'bouyIcon',
  MAIL_READY_DOCUMENTS_ICON = 'mailReadyDocumentsIcon',
  CONTACTS_ICON = 'contactsIcon',
  SUPPORT_TEXT_ICON = 'supportTextIcon',
  PROFILE_FEMALE_ICON = 'profileFemaleIcon',
  PROFILE_FILES_ICON = 'profileFilesIcon'
}

export type IconType = {
  iconSrc: string
  iconAlt: string
  iconHoveredSrc?: string
  iconHref?: string
  iconActiveSrc?: string
  customIconHeight?: IconWithCustomHeight
}


export enum SendEventsStatusEnum {
  STARTED = 'started',
  PREVIEW = 'ready',
  PREVIEWED = 'previewed',
  SCHEDULED = 'scheduled',
  PRINTED = 'printed',
  MAILED = 'mailed',
  RETURNED = 'returned',
  DELIVERED = 'delivered',
  RECEIVED = 'received',
  ACQUIRED = 'acquired',
  SENT = 'sent'
}

export enum ScoutEventsStatusEnum {
  SCHEDULED = 'scheduled',
  PROCESSING = 'processing',
  ACQUIRING = 'acquiring',
  ACQUIRED = 'acquired',
  LOCATING = 'locating',
  SCOUTED = 'scouted'
}


export enum StoreEventsStatusEnum {
  SCHEDULED = 'scheduled',
  JOURNAL_PUBLICATION = 'Journal Publication',
  JOURNAL_PUBLICATION_2 = 'journalPublication2',
  JOURNAL_PUBLICATION_3 = 'journalPublication3',
  OPEN = 'open',
  CLOSE_SALE = 'closeSale',
  FUNDED = 'funded',
  SIGNED = 'signed',
  RECORD = 'record',
  LIST = 'list',
  LISTED = 'listed',
  PROPERTY_INSPECTION = 'propertyInspection'
}

export enum SearchEventsStatusEnum {
  INITIATE = 'initiate',
  SCHEDULED = 'scheduled',
  SEARCHING = 'searching',
  SEARCHED = 'searched'
}

export enum SignEventsStatusEnum {
  PREPARED = 'prepared',
  REMOTE_NOTARY = 'remoteNotary',
  SIGNED = 'signed'
}

const NUMBER_TEN: string = '#10'
const PRESSURE_SEALED: string = 'Pressure Sealed'
const A_TEN: string = 'A10'
const POST_CARD: string = 'Postcard'

export const EnvelopeStyleTypes = {
  NUMBER_TEN,
  PRESSURE_SEALED,
  A_TEN,
  POST_CARD
} as const

export type TimelineDayEventsType = {
  id: string | number
  name: string
  appName: string
  type:
    | TimelineSendEventEnum
    | TimelineScoutEventEnum
    | TimelineStoreEventEnum
    | TimelineSearchEventEnum
    | TimelineSignEventEnum
  scheduledDate: Date
  centerIcon: IconType
  status:
    | SendEventsStatusEnum
    | ScoutEventsStatusEnum
    | StoreEventsStatusEnum
    | SearchEventsStatusEnum
    | SignEventsStatusEnum
  showDateCenterIcon?: boolean
  statusIcon?: IconType
  showMultiStatus?: boolean
  isReMailed?: boolean
  userRole?: string
  isDateSwiperCards?: boolean
  isPrinted?: boolean
  isMailed?: boolean
  isCompanionFirstClassMailCopy?: boolean
  selectedEnvelopeStyle?: (typeof EnvelopeStyleTypes)[keyof typeof EnvelopeStyleTypes] | ''
  mailedStatusData?: {
    mailed?: number
    sent?: number
    returned: number
    delivered: number
    reMailed?: number
    reSent?: number
    // store statuses
    scheduled?: number
    redeemed?: number
    published?: number
    publishedNumber1?: number
    publishedNumber2?: number
    calendared?: number
    inspected?: number
    noBids?: number
    open?: number
    bids?: number
    unsold?: number
    reOffered?: number
    closed?: number
    sold?: number
    invoiced?: number
    funded?: number
    signed?: number
    recorded?: number
    listed?: number
    aquired?: number
    aquiredAndDelivered?: number
  }
  totalCount?: number
  isDisabled?: boolean
  cardColor?: string
}