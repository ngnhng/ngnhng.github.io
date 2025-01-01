import React from "react";
import { Dock, DockIcon } from "@/components/ui/dock";
import Icons from "@/components/ui/icons";
import { HomeIcon, PencilIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { buttonVariants } from "./button";
import { Separator } from "./separator";

const DATA = {
  navbar: [
    { href: "#", icon: HomeIcon, label: "Home" },
    { href: "#", icon: PencilIcon, label: "Blog" },
  ],
  contact: {
    social: {
      GitHub: {
        name: "GitHub",
        url: "#",
        icon: Icons.github,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "#",
        icon: Icons.linkedin,
      },
      X: {
        name: "X",
        url: "#",
        icon: Icons.x,
      },
      email: {
        name: "Send Email",
        url: "#",
        icon: Icons.email,
      },
    },
  },
};

const Menu: React.FC = () => {
  return (
    <div className="dock-menu fixed bottom-10 left-0 w-full z-10">
      <TooltipProvider>
        <Dock direction="middle">
          {DATA.navbar.map((item) => (
            <DockIcon key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={item.href}
                    aria-label={item.label}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12 rounded-full"
                    )}
                  >
                    <item.icon className="size-4" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
          <Separator orientation="vertical" className="h-full" />
          {Object.entries(DATA.contact.social).map(([name, social]) => (
            <DockIcon key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={social.url}
                    aria-label={social.name}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12 rounded-full"
                    )}
                  >
                    <social.icon className="size-4" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
        </Dock>
      </TooltipProvider>
    </div>
  );
};

export default Menu;
