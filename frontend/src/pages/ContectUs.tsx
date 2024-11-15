const ContectUs = () => {
  return (
    <div className="pl-8 pt-8">
      <h1 className="text-5xl font-bold ">Contact Medium Support</h1>
      <div className="w-[70%] mt-6 text-2xl font-[300] ">
        <p>
          For quicker help, please refer to our support articles by going to the
          Help Center homepage at help.medium.com and searching for the issue
          you need help with.
        </p>
        <p className="mt-6">
          If you're unable to find a solution, Medium Support is ready to assist
          you via email support. To submit a request, click the Submit a request
          button in the top-right corner of the page, or to go to
          yourfriends.medium.com to get in touch with us.
        </p>
        <p className="mt-6">When submitting a ticket, please make sure to:</p>
        <ul className="list-inside list-decimal">
          <li>
            Describe your issue in detail so our support team can understand it.
          </li>
          <li>
            When reporting potential bugs, describe the steps necessary to
            reproduce them.
          </li>
          <li>
            Share the details of your platform (browser version, operating
            system, Medium app version, etc.)
          </li>
          <li>
            Whenever possible, attach screenshots or screen recordings of what
            you are seeing. They will help our support team understand and
            reproduce the issue.{" "}
          </li>
        </ul>
        <p className="mt-6">
          Please note that Medium does not provide phone support.
        </p>
      </div>
    </div>
  );
};

export default ContectUs;
