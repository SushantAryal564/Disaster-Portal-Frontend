import React, { useState } from "react";
import Layout from "../Layout/Layout";
import image from "./../../assests/image.jpg";
import Login from "../Form/loginForm";
import SignupForm from "../Form/RegistrationForm";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const LoginSignUp = (props) => {
  const dispatch = useDispatch();
  const LoggedInState = useSelector((state) => {
    console.log(state);
  });
  const [signin, changesign] = useState(true);
  const changesinghandler = () => {
    changesign(!signin);
  };
  return (
    <Layout>
      <section>
        <div className="px-6 h-full text-gray-800">
          <div className="flex xl:justify-center lg:justify-between justify-center flex-wrap h-full g-6">
            <div className=" pt-5  grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
              <img src={image} className="w-full" alt="Image of disaster" />
            </div>
            <div
              className={`${
                signin ? "self-center" : "self-start pt-5"
              }  xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0`}
            >
              {signin ? (
                <Login change={changesinghandler} />
              ) : (
                <SignupForm change={changesinghandler} />
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
export default LoginSignUp;
