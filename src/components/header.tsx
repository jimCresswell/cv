import { Mail, Linkedin, Github, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  name: string;
  title: string;
  email: string;
  linkedin: string;
  github?: string;
  website?: string;
  location?: string;
}

export function Header({
  name,
  title,
  linkedin,
  github,
  website,
  email,
  location,
}: HeaderProps) {
  return (
    <header className="text-center md:text-left border-b pb-6 dark:border-gray-700 print:pb-2">
      <h1 className="text-4xl md:text-5xl font-bold mb-2 print:mb-1">{name}</h1>
      <p className="text-xl md:text-2xl text-muted-foreground mb-4 print:mb-2">
        {title}
      </p>

      {/* For screen: contact information */}
      <div className="flex flex-col gap-3 justify-center md:justify-start print:hidden">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <Button variant="outline" size="sm" asChild>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="inline-flex items-center"
            >
              <Linkedin className="h-4 w-4 mr-2" />
              <span>LinkedIn</span>
            </a>
          </Button>

          {github && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="inline-flex items-center"
              >
                <Github className="h-4 w-4 mr-2" />
                <span>GitHub</span>
              </a>
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          {website && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Personal Website"
                className="inline-flex items-center"
              >
                <Globe className="h-4 w-4 mr-2" />
                <span>{website.replace(/^https?:\/\//, "")}</span>
              </a>
            </Button>
          )}
          {email && (
            <Button variant="outline" size="sm" asChild>
              <span aria-label="Email" className="inline-flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>{email}</span>
              </span>
            </Button>
          )}

          {location && (
            <div className="flex items-center text-sm text-muted-foreground px-3 py-1">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{location}</span>
            </div>
          )}
        </div>
      </div>

      {/* For print: contact information in a grid */}
      <div className="hidden print:grid print:grid-cols-2 print:gap-x-4 print:gap-y-1 print:w-full print:text-sm">
        <div className="flex items-center">
          <Mail className="h-3 w-3 shrink-0 mr-2" />
          <span>{email}</span>
        </div>
        <div className="flex items-center">
          <Linkedin className="h-3 w-3 shrink-0 mr-2" />
          <span>{linkedin.replace("https://linkedin.com/in/", "")}</span>
        </div>
        {github && (
          <div className="flex items-center">
            <Github className="h-3 w-3 shrink-0 mr-2" />
            <span>{github.replace("https://github.com/", "")}</span>
          </div>
        )}
        {website && (
          <div className="flex items-center">
            <Globe className="h-3 w-3 shrink-0 mr-2" />
            <span>{website.replace(/^https?:\/\//, "")}</span>
          </div>
        )}
        {location && (
          <div className="flex items-center">
            <MapPin className="h-3 w-3 shrink-0 mr-2" />
            <span>{location}</span>
          </div>
        )}
      </div>
    </header>
  );
}
