const ErrorText = ({ children }) => {
    if (!children) {
        return null;
    }

    return (
        <p className="mt-[5px] px-[4px] !text-[11px] !font-normal !leading-[16px] text-[#d8484d]">
            {children}
        </p>
    );
};


export default ErrorText;