import { Button, Hero } from "react-daisyui";

export const TailWindAndDaisyUIDemoPage = () => {
  return (
    <>
      <Hero
        style={{
          backgroundImage:
            "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
        }}
      >
        <Hero.Overlay />
        <Hero.Content className="text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              This is a demo showing Daisy & Tailwind work in this project,
              preserved in case they break...
            </p>

            <Button color="primary">Get Started</Button>
          </div>
        </Hero.Content>
      </Hero>
      <div className="flex flex-col justify-evenly items-center h-full w-full ">
        <div className="hover:bg-sky-700">#1</div>
        <div className="hover:bg-sky-700">#2</div>
        <div className="hover:bg-sky-700">#3</div>
      </div>
    </>
  );
};
