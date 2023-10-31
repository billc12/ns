import DrawerModel from '.'

const Information = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  return (
    <DrawerModel onClose={onClose} open={open} title="Information">
      Information
    </DrawerModel>
  )
}
export default Information
