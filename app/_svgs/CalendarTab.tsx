type TabPropTypes = {
  borderColor: string
  strokeWidth: number
  isFolioPage?: boolean
}

const YearlyTab = ({ borderColor, strokeWidth, isFolioPage }: TabPropTypes) => {
  if (isFolioPage) {
    return (
      <NormalTab
        borderColor={borderColor}
        strokeWidth={strokeWidth}
      />
    )
  }
  return (
    <NormalTab
      borderColor={borderColor}
      strokeWidth={strokeWidth}
    />
  )
}

const MonthlyTab = ({ borderColor, strokeWidth, isFolioPage }: TabPropTypes) => {
  if (isFolioPage) {
    return (
      <NormalTab
        borderColor={borderColor}
        strokeWidth={strokeWidth}
      />
    )
  }
  return (
    <NormalTab
      borderColor={borderColor}
      strokeWidth={strokeWidth}
    />
  )
}

const DailyTab = ({ borderColor, strokeWidth, isFolioPage }: TabPropTypes) => {
  if (isFolioPage) {
    return (
      <NormalTab
        borderColor={borderColor}
        strokeWidth={strokeWidth}
      />
    )
  }
  return (
    <NormalTab
      borderColor={borderColor}
      strokeWidth={strokeWidth}
    />
  )
}

// const YearlyNormalTab = ({ borderColor, strokeWidth }: TabPropTypes) => {
//   return (
//     <svg
//       width="159"
//       height="24"
//       viewBox="0 0 159 24"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M39.5685 22.0566H119.765C132.387 22.0566 144.545 11.9993 157.167 11.9993C144.545 11.9993 132.387 2.05664 119.765 2.05664H39.5685C26.9465 2.05664 14.7885 11.9993 2.1665 11.9993C14.7885 11.9993 26.9465 22.0566 39.5685 22.0566Z"
//         fill="white"
//         stroke={borderColor}
//         strokeWidth={`${strokeWidth}px`}
//         strokeLinejoin="round"
//       />
//     </svg>
//   )
// }

// const MonthlyNormalTab = ({ borderColor, strokeWidth }: TabPropTypes) => {
//   return (
//     <svg
//       width="256"
//       height="24"
//       viewBox="0 0 256 24"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M39.402 22.0566H216.598C229.22 22.0566 241.378 11.9993 254 11.9993C241.378 11.9993 229.22 2.05664 216.598 2.05664H39.402C26.78 2.05664 14.622 11.9993 2 11.9993C14.622 11.9993 26.78 22.0566 39.402 22.0566Z"
//         fill="white"
//         stroke={borderColor}
//         strokeWidth={`${strokeWidth}px`}
//         strokeLinejoin="round"
//       />
//     </svg>
//   )
// }

const NormalTab = ({ borderColor, strokeWidth }: TabPropTypes) => {
  return (
    <svg
      width="281"
      height="18"
      viewBox="0 0 281 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M29.5821 16.426H250.979C260.446 16.426 269.564 8.88306 279.031 8.88306C269.564 8.88306 260.446 1.42603 250.979 1.42603H29.5821C20.1156 1.42603 10.9971 8.88306 1.53061 8.88306C10.9971 8.88306 20.1156 16.426 29.5821 16.426Z"
        fill="white"
        className="calendar-text-border-path"
        stroke={borderColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  )
}

// const YearlyFolioTab = ({ borderColor, strokeWidth }: TabPropTypes) => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="100"
//       height="16"
//       viewBox="0 0 100 16"
//       fill="none"
//     >
//       <path
//         d="M4.76859 9.20037C3.913 8.79305 3.04831 8.4601 2.17464 8.25C3.04831 8.0399 3.913 7.70695 4.76859 7.29963C6.2585 6.59033 7.73839 5.64657 9.20223 4.71304L9.20968 4.70829C10.6816 3.76962 12.1374 2.84163 13.5969 2.14682C15.0553 1.45249 16.4998 1 17.9448 1H82.0552C83.5002 1 84.9447 1.45249 86.4032 2.14682C87.8626 2.84163 89.3184 3.76962 90.7903 4.70829L90.7977 4.71297C92.2615 5.64652 93.7415 6.59032 95.2314 7.29963C96.087 7.70695 96.9517 8.03989 97.8254 8.25C96.9517 8.4601 96.087 8.79305 95.2314 9.20037C93.7415 9.90968 92.2616 10.8535 90.7977 11.787L90.7903 11.7917C89.3184 12.7304 87.8626 13.6584 86.4032 14.3532C84.9447 15.0475 83.5002 15.5 82.0552 15.5H17.9448C16.4998 15.5 15.0553 15.0475 13.5968 14.3532C12.1374 13.6584 10.6816 12.7304 9.20968 11.7917L9.2022 11.7869C7.73837 10.8534 6.25849 9.90966 4.76859 9.20037Z"
//         fill="white"
//         stroke={borderColor}
//         strokeWidth={strokeWidth}
//       />
//     </svg>
//   )
// }

// const MonthlyFolioTab = ({ borderColor, strokeWidth }: TabPropTypes) => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="150"
//       height="16"
//       viewBox="0 0 150 16"
//       fill="none"
//     >
//       <path
//         d="M4.76859 9.20037C3.913 8.79305 3.04831 8.4601 2.17464 8.25C3.04831 8.0399 3.913 7.70695 4.76859 7.29963C6.2585 6.59033 7.73838 5.64658 9.20222 4.71305L9.20968 4.70829C10.6816 3.76962 12.1374 2.84163 13.5969 2.14682C15.0553 1.45249 16.4998 1 17.9448 1H132.055C133.5 1 134.945 1.45249 136.403 2.14682C137.863 2.84163 139.318 3.76962 140.79 4.70829L140.798 4.71308C142.262 5.6466 143.742 6.59034 145.231 7.29963C146.087 7.70695 146.952 8.03989 147.825 8.25C146.952 8.4601 146.087 8.79305 145.231 9.20037C143.742 9.90965 142.262 10.8534 140.798 11.7869L140.79 11.7917C139.318 12.7304 137.863 13.6584 136.403 14.3532C134.945 15.0475 133.5 15.5 132.055 15.5H17.9448C16.4998 15.5 15.0553 15.0475 13.5968 14.3532C12.1374 13.6584 10.6816 12.7304 9.20968 11.7917L9.2022 11.7869C7.73837 10.8534 6.25849 9.90966 4.76859 9.20037Z"
//         fill="white"
//         stroke={borderColor}
//         strokeWidth={strokeWidth}
//       />
//     </svg>
//   )
// }

// const DailyFolioTab = ({ borderColor, strokeWidth }: TabPropTypes) => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="200"
//       height="16"
//       viewBox="0 0 200 16"
//       fill="none"
//     >
//       <path
//         d="M4.76859 8.95037C3.913 8.54305 3.04831 8.2101 2.17464 8C3.04831 7.7899 3.913 7.45695 4.76859 7.04963C6.2585 6.34033 7.73839 5.39657 9.20223 4.46304L9.20968 4.45829C10.6816 3.51962 12.1374 2.59163 13.5969 1.89682C15.0553 1.20249 16.4998 0.75 17.9448 0.75H182.055C183.5 0.75 184.945 1.20249 186.403 1.89682C187.863 2.59163 189.318 3.51962 190.79 4.45829L190.798 4.46308C192.262 5.3966 193.742 6.34034 195.231 7.04963C196.087 7.45695 196.952 7.78989 197.825 8C196.952 8.2101 196.087 8.54305 195.231 8.95037C193.742 9.65965 192.262 10.6034 190.798 11.5369L190.79 11.5417C189.318 12.4804 187.863 13.4084 186.403 14.1032C184.945 14.7975 183.5 15.25 182.055 15.25H17.9448C16.4998 15.25 15.0553 14.7975 13.5968 14.1032C12.1374 13.4084 10.6816 12.4804 9.20968 11.5417L9.2022 11.5369C7.73837 10.6034 6.25849 9.65966 4.76859 8.95037Z"
//         fill="white"
//         stroke={borderColor}
//         strokeWidth={strokeWidth}
//       />
//     </svg>
//   )
// }

export default { YearlyTab, MonthlyTab, DailyTab }
