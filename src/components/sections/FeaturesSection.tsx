"use client";

import { theme, themeClasses } from "@/lib/theme";
import { useState } from "react";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    id: "natural",
    title: "Human Writing Style",
    description: "Our AI humanizer transforms robotic-sounding content into natural, flowing text that reads like it was written by a human.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18.7273 14.7273C18.6063 15.0909 18.6518 15.4818 18.8591 15.8091L18.9127 15.8945C19.0782 16.1364 19.1636 16.4173 19.1636 16.7055C19.1636 16.9936 19.0782 17.2745 18.9127 17.5164C18.7473 17.7582 18.5102 17.9427 18.2318 18.0436C17.9535 18.1445 17.6487 18.1569 17.3618 18.0791L17.2618 18.0473C16.9 17.9345 16.5091 17.98 16.1818 18.1873C15.8591 18.3945 15.6345 18.7291 15.5709 19.1055L15.5527 19.2055C15.5055 19.4895 15.3682 19.7498 15.1618 19.9424C14.9555 20.135 14.6894 20.2482 14.4055 20.2673C14.1215 20.2864 13.8405 20.2102 13.6073 20.0518C13.3741 19.8934 13.2017 19.6621 13.1127 19.3909L13.0809 19.2909C13.0173 18.9145 12.7927 18.58 12.47 18.3727C12.1473 18.1655 11.7564 18.12 11.3945 18.2327L11.2945 18.2645C11.0076 18.3423 10.7029 18.3299 10.4245 18.229C10.1462 18.1281 9.90909 17.9436 9.74364 17.7018C9.57818 17.46 9.49273 17.1791 9.49273 16.8909C9.49273 16.6027 9.57818 16.3218 9.74364 16.08L9.79727 15.9945C10.0045 15.6673 10.05 15.2764 9.93727 14.9145C9.82455 14.5527 9.59 14.2673 9.27273 14.1236L9.17273 14.0918C8.90147 14.0028 8.67016 13.8304 8.51179 13.5973C8.35342 13.3641 8.27716 13.0831 8.29627 12.7991C8.31538 12.5151 8.42865 12.249 8.62125 12.0427C8.81385 11.8363 9.07416 11.699 9.35818 11.6518L9.45818 11.6336C9.83455 11.57 10.1691 11.3455 10.3764 11.0227C10.5836 10.6955 10.6291 10.3045 10.5164 9.94273L10.4845 9.84273C10.4068 9.55582 10.4192 9.25103 10.5201 8.97267C10.621 8.69431 10.8055 8.45717 11.0473 8.29173C11.2891 8.12629 11.57 8.04086 11.8582 8.04086C12.1464 8.04086 12.4273 8.12629 12.6691 8.29173L12.7545 8.34536C13.0818 8.55264 13.4727 8.59809 13.8345 8.48536H13.9345C14.2964 8.37264 14.5818 8.13809 14.7255 7.82082L14.7573 7.72082C14.8462 7.44956 15.0187 7.21826 15.2518 7.05988C15.485 6.90151 15.766 6.82526 16.05 6.84437C16.334 6.86348 16.6001 6.97675 16.8064 7.16935C17.0128 7.36195 17.1501 7.62226 17.1973 7.90627L17.2155 8.00627C17.2791 8.38264 17.5036 8.71718 17.8264 8.92445C18.1491 9.13173 18.54 9.17718 18.9018 9.06445L19.0018 9.03264C19.2887 8.95486 19.5935 8.9673 19.8718 9.06818C20.1502 9.16906 20.3873 9.35358 20.5527 9.59539C20.7182 9.83721 20.8036 10.1181 20.8036 10.4062C20.8036 10.6944 20.7182 10.9753 20.5527 11.2171L20.4991 11.3025C20.2918 11.6298 20.2464 12.0207 20.3591 12.3825C20.4718 12.7444 20.7064 13.0298 21.0236 13.1734L21.1236 13.2053C21.3949 13.2942 21.6262 13.4667 21.7846 13.6998C21.943 13.933 22.0192 14.214 22.0001 14.498C21.981 14.782 21.8677 15.0481 21.6751 15.2544C21.4825 15.4608 21.2222 15.5981 20.9382 15.6453L20.8382 15.6634C20.4618 15.7271 20.1273 15.9516 19.92 16.2744C19.7127 16.5971 19.6673 16.988 19.78 17.3498L19.8118 17.4498C19.8896 17.7368 19.8772 18.0415 19.7763 18.3199C19.6754 18.5982 19.4909 18.8354 19.2491 19.0008C19.0073 19.1663 18.7264 19.2517 18.4382 19.2517C18.15 19.2517 17.8691 19.1663 17.6273 19.0008L17.5418 18.9473C17.2145 18.74 16.8236 18.6945 16.4618 18.8073C16.1 18.92 15.8145 19.1545 15.6709 19.4718L15.6391 19.5718C15.5501 19.8431 15.3777 20.0744 15.1445 20.2327C14.9114 20.3911 14.6304 20.4674 14.3464 20.4482C14.0624 20.4291 13.7963 20.3159 13.59 20.1233C13.3836 19.9307 13.2464 19.6704 13.1991 19.3864L13.1809 19.2864C13.1173 18.91 12.8927 18.5755 12.57 18.3682C12.2473 18.1609 11.8564 18.1155 11.4945 18.2282L11.3945 18.26C11.1076 18.3378 10.8029 18.3253 10.5245 18.2245C10.2462 18.1236 10.0091 17.9391 9.84364 17.6973C9.67818 17.4554 9.59273 17.1745 9.59273 16.8864C9.59273 16.5982 9.67818 16.3173 9.84364 16.0755L9.89727 15.99C10.1045 15.6627 10.15 15.2718 10.0373 14.91C9.92455 14.5482 9.69 14.2627 9.37273 14.1191L9.27273 14.0873C9.01147 13.9983 8.78016 13.8258 8.62179 13.5927C8.46342 13.3595 8.38716 13.0785 8.40627 12.7945C8.42538 12.5105 8.53865 12.2444 8.73125 12.0381C8.92385 11.8317 9.18416 11.6945 9.46818 11.6473L9.56818 11.6291C9.94455 11.5655 10.2791 11.3409 10.4864 11.0182C10.6936 10.6955 10.7391 10.3045 10.6264 9.94273L10.5945 9.84273C10.5168 9.55582 10.5292 9.25103 10.6301 8.97267C10.731 8.69431 10.9155 8.45717 11.1573 8.29173C11.3991 8.12629 11.68 8.04086 11.9682 8.04086C12.2564 8.04086 12.5373 8.12629 12.7791 8.29173L12.8645 8.34536C13.1918 8.55264 13.5827 8.59809 13.9445 8.48536H14.0445C14.4064 8.37264 14.6918 8.13809 14.8355 7.82082L14.8673 7.72082C14.9562 7.44956 15.1287 7.21826 15.3618 7.05988C15.595 6.90151 15.876 6.82526 16.16 6.84437C16.444 6.86348 16.7101 6.97675 16.9164 7.16935C17.1228 7.36195 17.2601 7.62226 17.3073 7.90627L17.3255 8.00627C17.3891 8.38264 17.6136 8.71718 17.9364 8.92445C18.2591 9.13173 18.65 9.17718 19.0118 9.06445L19.1118 9.03264C19.3987 8.95486 19.7035 8.9673 19.9818 9.06818C20.2602 9.16906 20.4973 9.35358 20.6627 9.59539C20.8282 9.83721 20.9136 10.1181 20.9136 10.4062C20.9136 10.6944 20.8282 10.9753 20.6627 11.2171L20.6091 11.3025C20.4018 11.6298 20.3564 12.0207 20.4691 12.3825C20.5818 12.7444 20.8164 13.0298 21.1336 13.1734L21.2336 13.2053C21.5049 13.2942 21.7362 13.4667 21.8946 13.6998C22.053 13.933 22.1292 14.214 22.1101 14.498C22.091 14.782 21.9777 15.0481 21.7851 15.2544C21.5925 15.4608 21.3322 15.5981 21.0482 15.6453L20.9482 15.6634C20.5718 15.7271 20.2373 15.9516 20.03 16.2744C19.8227 16.5971 19.7773 16.988 19.89 17.3498L19.9218 17.4498C19.9996 17.7368 19.9872 18.0415 19.8863 18.3199C19.7854 18.5982 19.6009 18.8354 19.3591 19.0008C19.1173 19.1663 18.8364 19.2517 18.5482 19.2517C18.26 19.2517 17.9791 19.1663 17.7373 19.0008L17.6518 18.9473C17.3245 18.74 16.9336 18.6945 16.5718 18.8073C16.21 18.92 15.9245 19.1545 15.7809 19.4718L15.7491 19.5718C15.6601 19.8431 15.4877 20.0744 15.2545 20.2327C15.0214 20.3911 14.7404 20.4674 14.4564 20.4482C14.1724 20.4291 13.9063 20.3159 13.7 20.1233C13.4936 19.9307 13.3564 19.6704 13.3091 19.3864L13.2909 19.2864C13.2273 18.91 13.0027 18.5755 12.68 18.3682C12.3573 18.1609 11.9664 18.1155 11.6045 18.2282L11.5045 18.26C11.2176 18.3378 10.9129 18.3253 10.6345 18.2245C10.3562 18.1236 10.1191 17.9391 9.95364 17.6973C9.78818 17.4554 9.70273 17.1745 9.70273 16.8864C9.70273 16.5982 9.78818 16.3173 9.95364 16.0755L10.0073 15.99C10.2145 15.6627 10.26 15.2718 10.1473 14.91C10.0345 14.5482 9.8 14.2627 9.48273 14.1191L9.38273 14.0873C9.12147 13.9983 8.89016 13.8258 8.73179 13.5927C8.57342 13.3595 8.49716 13.0785 8.51627 12.7945C8.53538 12.5105 8.64865 12.2444 8.84125 12.0381C9.03385 11.8317 9.29416 11.6945 9.57818 11.6473L9.67818 11.6291C10.0545 11.5655 10.3891 11.3409 10.5964 11.0182C10.8036 10.6955 10.8491 10.3045 10.7364 9.94273L10.7045 9.84273C10.6268 9.55582 10.6392 9.25103 10.7401 8.97267C10.841 8.69431 11.0255 8.45717 11.2673 8.29173C11.5091 8.12629 11.79 8.04086 12.0782 8.04086C12.3664 8.04086 12.6473 8.12629 12.8891 8.29173L12.9745 8.34536C13.3018 8.55264 13.6927 8.59809 14.0545 8.48536H14.1545C14.5164 8.37264 14.8018 8.13809 14.9455 7.82082L14.9773 7.72082C15.0662 7.44956 15.2387 7.21826 15.4718 7.05988C15.705 6.90151 15.986 6.82526 16.27 6.84437C16.554 6.86348 16.8201 6.97675 17.0264 7.16935C17.2328 7.36195 17.3701 7.62226 17.4173 7.90627L17.4355 8.00627C17.4991 8.38264 17.7236 8.71718 18.0464 8.92445C18.3691 9.13173 18.76 9.17718 19.1218 9.06445L19.2218 9.03264C19.5087 8.95486 19.8135 8.9673 20.0918 9.06818C20.3702 9.16906 20.6073 9.35358 20.7727 9.59539C20.9382 9.83721 21.0236 10.1181 21.0236 10.4062C21.0236 10.6944 20.9382 10.9753 20.7727 11.2171L20.7191 11.3025C20.5118 11.6298 20.4664 12.0207 20.5791 12.3825C20.6918 12.7444 20.9264 13.0298 21.2436 13.1734L21.3436 13.2053C21.6149 13.2942 21.8462 13.4667 22.0046 13.6998C22.163 13.933 22.2392 14.214 22.2201 14.498C22.201 14.782 22.0877 15.0481 21.8951 15.2544C21.7025 15.4608 21.4422 15.5981 21.1582 15.6453L21.0582 15.6634C20.6818 15.7271 20.3473 15.9516 20.14 16.2744C19.9327 16.5971 19.8873 16.988 20 17.3498" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "paraphrase",
    title: "Smart Paraphrasing",
    description: "Our advanced paraphrasing technology restructures sentences while preserving meaning, making content undetectable by AI scanners.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 9L11 12L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13 9L16 12L13 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12Z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    id: "semantic",
    title: "Semantic Accuracy",
    description: "We maintain the original meaning and intent of your content while making it uniquely human.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 10L12 14L8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "style",
    title: "Customizable Style",
    description: "Choose from multiple writing styles to match your brand voice and audience expectations.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 20H8L18 10L14 6L4 16V20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "fast",
    title: "Instant Results",
    description: "Get your humanized content in seconds, no matter how long the text is.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "secure",
    title: "Privacy Focused",
    description: "We don't store your content after processing, ensuring your data remains private and secure.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export const FeaturesSection = () => {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            Powerful Features
          </h2>
          <p className={`text-[${theme.colors.textLight}] max-w-2xl mx-auto text-lg`}>
            Transform AI-generated text into natural human writing with our advanced technology
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className={`p-8 rounded-xl transition-all duration-300 relative overflow-hidden
                ${hoveredFeature === feature.id 
                  ? 'shadow-lg transform -translate-y-1' 
                  : 'shadow-sm hover:shadow-md border border-gray-100'}`}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div 
                className={`text-white p-3 rounded-lg mb-5 inline-flex
                  ${hoveredFeature === feature.id 
                    ? themeClasses.gradientBlue
                    : `bg-[${theme.colors.primary}]`}`}
              >
                <div className="w-6 h-6">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className={`text-xl font-semibold mb-3 text-[${theme.colors.text}]`}>
                {feature.title}
              </h3>
              
              <p className={`text-[${theme.colors.textLight}]`}>
                {feature.description}
              </p>
              
              {hoveredFeature === feature.id && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-300"></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className={`inline-block py-2 px-4 rounded-full text-sm bg-[${theme.colors.secondary}] text-[${theme.colors.primary}] font-medium`}>
            All features available on every plan
          </div>
        </div>
      </div>
    </section>
  );
}; 