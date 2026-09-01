import { RegisterForm } from "@/components/RegisterForm";

const brandingImageUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBH6m3v6PSM4GsPD2iE7Nhz26dMTD4KTaVHOum-eBX88qxXzsHWdouZVA-Irlc4B5ATZFpjTWHPflYD9E05jCNvE2DMga6o18zRAEhgs1YMPvfOyswUXfj_oZuTQqqbmpMfPO-b-Mg4NS6KqpKKzhjvC7lS6yDIh8frar9R9A2ZWViuTb_Dkujxejfs6ji3f_tWyagQj8qcXdNzif1ZngKFYXs0sW71BDdix-U3hJ2LJGm0Qmn7XJML6g";

export default function RegistroPage() {
  return (
    <main className="flex min-h-screen w-full flex-grow">
      <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-surface-container-highest lg:flex">
        <div className="absolute inset-0 z-0">
          <div
            className="h-full w-full bg-cover bg-center"
            data-alt="A modern, brightly lit corporate office space featuring sleek glass walls, minimalist desks, and soft natural light streaming in. The atmosphere is professional, efficient, and technologically advanced, conveying a sense of organized project management. The color palette emphasizes clean whites, soft grays, and subtle hints of corporate blue."
            style={{ backgroundImage: `url("${brandingImageUrl}")` }}
          />
          <div className="absolute inset-0 bg-primary-container/70 mix-blend-multiply" />
        </div>
        <div className="relative z-10 flex max-w-lg flex-col items-center p-2xl text-center">
          <div className="mb-lg flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-lg">
            <span className="material-symbols-outlined fill text-[32px] text-secondary">
              dashboard_customize
            </span>
          </div>
          <h1 className="font-display-lg mb-md text-display-lg text-white">
            ProManage
          </h1>
          <p className="font-title-lg text-title-lg text-secondary-fixed-dim">
            Gestiona tus proyectos con eficiencia
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-surface-container-lowest p-lg lg:w-1/2 lg:p-[48px]">
        <div className="w-full max-w-md space-y-xl">
          <div className="mb-xl flex justify-center lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary shadow-sm">
              <span className="material-symbols-outlined fill text-[24px] text-white">
                dashboard_customize
              </span>
            </div>
          </div>
          <div className="space-y-sm text-center lg:text-left">
            <h2 className="font-headline-lg text-headline-lg-mobile text-on-surface md:text-headline-lg">
              Crea una cuenta
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Crea una cuenta con nombre, correo y clave para acceder a la
              plataforma.
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
