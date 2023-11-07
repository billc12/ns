interface Props {
  url: string
  defaultUrl: string
  errUrl?: string
  alt?: string
}
export const ShowErrImg = ({ defaultUrl, url, alt, errUrl }: Props) => {
  const handleImgErr = (e: any) => {
    e.target.src = errUrl || defaultUrl
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url || defaultUrl} alt={alt || 'img'} onError={handleImgErr} />
  )
}
