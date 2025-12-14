const Corners = () => {
  return (
    <>
      {/* Góc trên */}
      <div
        className={`w-full h-[2vh] fixed top-0 left-0 bg-blueprint rounded-xl rounded-b-none`}
      ></div>
      {/* Góc dưới */}
      <div
        className={`w-full h-[2vh] fixed bottom-0 left-0 bg-blueprint rounded-xl rounded-t-none`}
      ></div>
      {/* Góc trái */}
      <div
        className={`w-[2vh] h-full fixed top-0 left-0 bg-blueprint rounded-xl rounded-r-none`}
      ></div>
      {/* Góc phải */}
      <div
        className={`w-[2vh] h-full fixed top-0 right-0 bg-blueprint rounded-xl rounded-l-none`}
      ></div>
    </>
  )
}

export default Corners
