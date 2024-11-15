const Quote = () => {
  return (
    <div className="h-screen bg-slate-200 flex justify-center items-center">
      <div className="flex justify-center flex-col m-5 text-center">
        <div className="max-w-lg text-3xl font-bold mb-3">
          The customer service I received was exceptional. The support team went
          above and beyond to address my concerns.
        </div>
        <div className="max-w-md text-xl font-semibold">Julies Winfield</div>
        <div className="max-w-md text-lg font-light text-slate-400">
          CEO | Acme Corp
        </div>
      </div>
    </div>
  );
};

export default Quote;
