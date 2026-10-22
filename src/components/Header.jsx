import {
  ArrowRight,
  Bell,
  Mail,
  SearchIcon,
  ShoppingCart,
  SmartphoneIcon,
} from "lucide-react";
import { Link } from "react-router";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./ui/input-group";
import { Button } from "./ui/button";
import DialogLogin from "./DialogLogin";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@/lib/user";
import { Separator } from "./ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import DialogRegister from "./DialogRegister";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import React from "react"; // Pastikan React terimpor jika menggunakan Fragment

const menu = ["Fixie", "MTB", "Roadbike", "Gravel", "Aksesoris Sepeda", "Suku Cadang Sepeda", "Frame Sepeda", "Event"]; // Contoh isi data menu

export default function Header() {
  const [Login, setLogin] = useState(false);
  const [Register, setRegister] = useState(false);

  const { user, loading, handleLogout } = useUser();

  return (
    <div className="fixed w-full bg-background">
      <div className="bg-accent py-2.5 px-3 flex items-center justify-between">
        <span className="flex items-center text-xs font-semibold space-x-1">
          <SmartphoneIcon className="size-4.5" /> Download Aplikasi
          <span className="ml-1 font-normal text-accent-foreground">
            untuk dapat diskon
          </span>
          <ArrowRight className="size-4" />
        </span>
        <div className="text-xs text-accent-foreground space-x-5">
          <span>Dukung Kami</span>
          <span>Tentang</span>
        </div>
      </div>

      <div className="border-b">
        <nav className="mx-auto py-3 max-w-450 flex items-center justify-between">
          <Link to={"/"} className={"font-bold text-2xl"}>
            belisepeda.
          </Link>

          <InputGroup className={"max-w-6xl"}>
            <InputGroupInput id="input-group-url" placeholder="Frame Tsunami" />
            <InputGroupAddon>
              <InputGroupText>Search: </InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>

          <div className="flex items-center gap-5 h-6">
            <div className="flex items-center justify-between gap-7">
              <div>
                <Button size="icon" variant="ghost">
                  <ShoppingCart />
                </Button>
                <Button size="icon" variant="ghost">
                  <Bell />
                </Button>
                <Button size="icon" variant="ghost">
                  <Mail />
                </Button>
              </div>
            </div>
            <Separator orientation="vertical" />
            {loading ? (
              <div className="size-9 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    {user.profile_photo ? (
                      <AvatarImage
                        src={user.profile_photo_url}
                        alt={user.name}
                      />
                    ) : (
                      <AvatarFallback>
                        {user.name
                          ?.trim()
                          .split(/\s+/)
                          .filter(Boolean)
                          .map((word) => word[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <Link to={"/profile"}>
                      <DropdownMenuItem className={"cursor-pointer"}>
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className={"cursor-pointer"}>
                      Settings
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => handleLogout()}
                      className={"cursor-pointer"}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-x-2">
                <Button onClick={() => setLogin(true)}>Masuk</Button>
                <Button onClick={() => setRegister(true)} variant="outline">
                  Daftar
                </Button>
              </div>
            )}
          </div>

          <DialogLogin
            open={Login}
            onOpenChange={setLogin}
            onSwitchToRegister={() => setRegister(true)}
          />
          <DialogRegister
            open={Register}
            onOpenChange={setRegister}
            onSwitchToLogin={() => setLogin(true)}
          />
        </nav>
      </div>

      <div className="border-b">
        <NavigationMenu className={"max-w-450"}>
          <NavigationMenuList className="flex items-center">
            {menu.map((Item, index) => (
              <React.Fragment key={index}>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={"px-5"}
                    render={<Link to={`/docs`}>{Item}</Link>}
                  />
                </NavigationMenuItem>

                {index < menu.length - 1 && (
                  <Separator orientation="vertical" />
                )}
              </React.Fragment>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
